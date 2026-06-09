const HallTickets = require("../models/hallTicket.js");
const { default: mongoose } = require("mongoose");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const fontkit = require("fontkit");
const fs = require("fs");
const moment = require("moment");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const examRegistration = require("../models/examRegistration.js");
const { text } = require("stream/consumers");

const s3 = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// Helper to normalize Roman numerals to ASCII
const normalizeExamType = (str) => {
  const normalized = str.replace(/Ⅲ/g, "III").replace(/Ⅱ/g, "II").replace(/Ⅰ/g, "I");
  if (str !== normalized) {
    console.log(`Normalized exam type from "${str}" to "${normalized}"`);
  }
  return normalized;
};

// @desc      ADD HALL TICKET
// @route     POST /api/hallTicket/hall-Ticket
// @access    public
exports.addHallTicket = async (req, res) => {
  try {
    const response = await HallTickets.create(req.body);
    console.log(req.body);
    res.status(200).json({ success: true, message: `succefully added hallTicket `, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET HALL TICKET
// @route     GET /api/v1/hall-ticket
// @access    public
exports.getHallTicket = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    const populateOpts = {
      path: "nameOfApplicant",
      select: "nameOfApplicant mobileNumber regno status district area centerRegistration nameOfExamAppearingNow assignedExamCenter gender",
      populate: [
        { path: "district", select: "district" },
        { path: "area", select: "area" },
        { path: "centerRegistration", select: "nameOfCenter centerCode" },
        { path: "nameOfExamAppearingNow", select: "examType" },
        { path: "assignedExamCenter", select: "nameOfCenter centerCode" },
      ],
    };

    if (id && mongoose.isValidObjectId(id)) {
      const response = await HallTickets.findById(id).populate(populateOpts);
      return res.status(200).json({ success: true, message: "Retrieved specific hallTicket", response });
    }
    const query = { ...req.filter };
    let data;

    if (searchkey) {
      // Search across multiple fields in exam registrations
      const searchRegex = { $regex: searchkey, $options: "i" };
      const matchingRegistrations = await examRegistration
        .find({
          $or: [
            { nameOfApplicant: searchRegex },
            { regno: searchRegex },
            { mobileNumber: !isNaN(searchkey) ? Number(searchkey) : undefined },
          ].filter((c) => !Object.values(c).includes(undefined)),
        })
        .select("_id");

      const registrationIds = matchingRegistrations.map((reg) => reg._id);

      data = await HallTickets.find({
        ...query,
        nameOfApplicant: { $in: registrationIds },
      })
        .populate(populateOpts)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50);
    } else {
      data = await HallTickets.find(query)
        .populate(populateOpts)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50);
    }

    const [totalCount, filterCount] = await Promise.all([
      parseInt(skip) === 0 && HallTickets.countDocuments(),
      parseInt(skip) === 0 &&
        (searchkey
          ? HallTickets.countDocuments({
              ...query,
              nameOfApplicant: {
                $in: await examRegistration
                  .find({
                    $or: [
                      { nameOfApplicant: { $regex: searchkey, $options: "i" } },
                      { regno: { $regex: searchkey, $options: "i" } },
                      { mobileNumber: !isNaN(searchkey) ? Number(searchkey) : undefined },
                    ].filter((c) => !Object.values(c).includes(undefined)),
                  })
                  .select("_id")
                  .then((regs) => regs.map((reg) => reg._id)),
              },
            })
          : HallTickets.countDocuments(query)),
    ]);

    res.status(200).json({ success: true, message: `Retrieved all hallTicket`, response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DOWNLOAD HALL TICKET
// @route     GET /api/v1/hall-ticket/download
// @access    public
exports.downloadHallTicket = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(400).json({ success: false, customMessage: "Mobile number is required" });
    }

    // Find user data (your existing code)
    const user = await examRegistration
      .findOne({ mobileNumber })
      .populate({ path: "centerRegistration", select: "nameOfCenter centerCode" })
      .populate({ path: "assignedExamCenter", select: "nameOfCenter centerCode" })
      .populate({ path: "district", select: "district" })
      .populate({ path: "examCenter", select: "centerName" })
      .populate({ path: "outsideExamCenter", select: "centerName" })
      .populate({ path: "nameOfExamAppearingNow", select: "examType" });

    if (!user) {
      return res.status(404).json({
        success: false,
        customMessage: "User not found",
      });
    }

    // Read the PDF template
    const templatePath = path.join(__dirname, "Hal_Ticket_2025.pdf");
    const templateBytes = await fs.promises.readFile(templatePath);

    // Load PDF and register fontkit
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);

    // Embed standard font
    const standardFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Try to load Malayalam font with better error handling
    let malayalamFont = null;
    const possibleFontPaths = [path.join(__dirname, "NotoSansMalayalam-Regular.ttf"), path.join(__dirname, "fonts", "NotoSansMalayalam-Regular.ttf"), path.join(__dirname, "assets", "NotoSansMalayalam-Regular.ttf")];

    for (const fontPath of possibleFontPaths) {
      try {
        if (fs.existsSync(fontPath)) {
          const malayalamFontBytes = await fs.promises.readFile(fontPath);

          // Verify it's a valid TTF file by checking the first 4 bytes
          if (malayalamFontBytes.length > 4) {
            const signature = malayalamFontBytes.slice(0, 4).toString("ascii");
            if (signature === "\x00\x01\x00\x00" || signature === "OTTO" || signature === "true" || signature === "typ1") {
              malayalamFont = await pdfDoc.embedFont(malayalamFontBytes);
              console.log(`Successfully loaded Malayalam font from: ${fontPath}`);
              break;
            }
          }
        }
      } catch (fontError) {
        console.log(`Failed to load font from ${fontPath}:`, fontError.message);
        continue;
      }
    }

    if (!malayalamFont) {
      console.log("No Malayalam font found, will use ASCII-only approach");
    }

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const drawText = (text, x, y, size = 16) => {
      if (!text) return;

      try {
        const textStr = normalizeExamType(text.toString());

        // Check if this is the exam type field
        if (x === 185 && y === 540) {
          drawExamTypeMultiLine(textStr, x, y, 12);
          return;
        }

        if (malayalamFont && /[\u0D00-\u0D7F]/.test(textStr)) {
          firstPage.drawText(textStr, {
            x,
            y,
            size,
            font: malayalamFont,
          });
        } else if (/^[\x00-\x7F]*$/.test(textStr)) {
          firstPage.drawText(textStr, {
            x,
            y,
            size,
            font: standardFont,
          });
        } else {
          const asciiOnly = textStr
            .replace(/[^\x00-\x7F]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/[,\s]+$/, "")
            .replace(/:\s*[,\s]*$/, ":");

          if (asciiOnly && asciiOnly !== "") {
            firstPage.drawText(asciiOnly, {
              x,
              y,
              size,
              font: standardFont,
            });
          }
        }
      } catch (error) {
        console.error(`❌ Error drawing text: "${text.toString().substring(0, 30)}..."`, error.message);
      }
    };

    // Keep the original textFields with y:525
    const textFields = [
      { text: user.regno?.toString() || "NIL", x: 185, y: 709 },
      { text: (user.status || "Regular").toUpperCase(), x: 460, y: 709 },
      { text: user.nameOfApplicant || "NIL", x: 185, y: 677 },
      { text: user.centerRegistration?.nameOfCenter || "NIL", x: 185, y: 633 },
      { text: user.district?.district || "NIL", x: 185, y: 595 },
      {
        text:
          user.assignedExamCenter?.nameOfCenter ||
          user.examCenter?.centerName ||
          user.outsideExamCenter?.centerName ||
          user.centerRegistration?.nameOfCenter ||
          "NIL",
        x: 185,
        y: 565,
      },
      { text: user.nameOfExamAppearingNow?.examType || "NIL", x: 185, y: 540 },
    ];

    const drawExamTypeMultiLine = (text, x, y, size = 7) => {
      try {
        const normText = normalizeExamType(text);
        const lineHeight = size;
        const maxLines = 4;
        const targetCharsPerLine = 45;
        const words = normText.split(/\s+/);
        const lines = [];
        let currentLine = "";
        words.forEach((word) => {
          if ((currentLine + " " + word).trim().length > targetCharsPerLine && lines.length < maxLines - 1) {
            lines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine += (currentLine ? " " : "") + word;
          }
        });
        if (currentLine) lines.push(currentLine.trim());
        while (lines.length < maxLines) lines.push("");
        lines.slice(0, maxLines).forEach((line, index) => {
          if (!line.trim()) return;
          const lineY = y - index * lineHeight;
          // Log the line after normalization
          console.log(`[drawExamTypeMultiLine] Drawing line:`, line);

          if (line.includes(":")) {
            drawMixedFontLine(line, x, lineY, size);
          } else {
            const usesMalayalam = /[\u0D00-\u0D7F]/.test(line);
            let font = standardFont;
            let textToDraw = line;
            if (usesMalayalam && malayalamFont) {
              font = malayalamFont;
            }
            // Log which font is being used
            console.log(`[drawExamTypeMultiLine] Using font:`, font === malayalamFont ? "malayalamFont" : "standardFont");
            firstPage.drawText(textToDraw, {
              x,
              y: lineY,
              size,
              font,
            });
          }
        });
      } catch (error) {
        console.error("❌ Error in drawExamTypeMultiLine:", error.message);
      }
    };

    // Update the mixed font function for smaller size
    const drawMixedFontLine = (text, x, y, size) => {
      try {
        const colonIndex = text.indexOf(":");
        if (colonIndex === -1) {
          const font = /[\u0D00-\u0D7F]/.test(text) && malayalamFont ? malayalamFont : standardFont;
          firstPage.drawText(text, { x, y, size, font });
          return;
        }

        const englishPart = text.substring(0, colonIndex + 1).trim();
        const malayalamPart = text.substring(colonIndex + 1).trim();

        // Draw English part
        firstPage.drawText(englishPart, {
          x,
          y,
          size,
          font: standardFont,
        });

        // Calculate width for Malayalam positioning (adjusted for smaller font)
        const englishWidth = englishPart.length * (size * 0.4); // Reduced multiplier for size 7

        // Draw Malayalam part
        if (malayalamPart && malayalamFont) {
          firstPage.drawText(" " + malayalamPart, {
            x: x + englishWidth,
            y,
            size,
            font: malayalamFont,
          });
        }
      } catch (error) {
        console.error("❌ Error in drawMixedFontLine:", error.message);
        firstPage.drawText(text, { x, y, size, font: standardFont });
      }
    };

    // Draw all text fields
    textFields.forEach((field) => {
      drawText(field.text, field.x, field.y);
    });

    // Save and upload (your existing code)
    const modifiedPdfBytes = await pdfDoc.save();
    const folder = process.env.DO_SPACES_FOLDER || "";
    const fileName = folder ? `${folder}/hallTickets/HallTicket-${Date.now()}.pdf` : `hallTickets/HallTicket-${Date.now()}.pdf`;

    const uploadParams = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      Body: modifiedPdfBytes,
      ContentType: "application/pdf",
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const cdnUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${fileName}`;

    return res.status(200).json({
      success: true,
      message: "Hall ticket generated successfully",
      url: cdnUrl,
      fontStatus: malayalamFont ? "Malayalam font loaded" : "ASCII-only mode",
    });
  } catch (error) {
    console.error("Hall ticket generation error:", error);
    return res.status(400).json({
      success: false,
      message: error.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC HallTicket
// @route     PUT /api/user/HallTicket
// @access    public
exports.updateHallTicket = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await HallTickets.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, message: `updated specific hallTicket`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      DELETE SPECIFIC HallTicket
// @route     DELETE /api/user/hallTicket
// @access    public
exports.deleteHallTicket = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await HallTickets.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `deleted specific hallTicket`, response });
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};

// @desc      GET HallTicketS
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await HallTickets.find({}, { _id: 0, id: "$_id", value: "$registerNo" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({ success: false, message: err });
  }
};
