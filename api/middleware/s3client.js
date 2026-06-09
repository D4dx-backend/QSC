const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { NodeHttpHandler } = require("@smithy/node-http-handler");
const fs = require("fs");
const dotenv = require("dotenv");
const sharp = require("sharp");
dotenv.config({ path: ".env" });
const mime = require("mime-types");

const s3 = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  maxAttempts: 2,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 15000,
    socketTimeout: 120000,
  }),
});

exports.getS3Middleware = (fieldNames, doThumbnail = true, compress = true, maxWidth = 1000, deleteFile = true) => {
  return async (req, res, next) => {
    const processField = async (fieldName) => {
      const filePath = req.body[fieldName];
      const ogFilePath = req.body["old_" + fieldName] || "";

      if (typeof filePath === "undefined" || filePath === null || filePath === "") {
        delete req.body[fieldName];
        delete req.body[fieldName + "Thumbnail"];
        return;
      }

      if (typeof filePath !== "string") {
        console.log(`Invalid filePath for field ${fieldName}:`, filePath);
        delete req.body[fieldName];
        delete req.body[fieldName + "Thumbnail"];
        return;
      }

      const folder = process.env.DO_SPACES_FOLDER || "";
      const s3Key = folder ? `${folder}/${filePath}` : filePath;

      const isImage = filePath.endsWith(".jpg") || filePath.endsWith(".jpeg") || filePath.endsWith(".png");
      let thumbnailKey = "";
      compress = compress && isImage;
      let fileContent;
      let ContentType;

      try {
        if (compress) {
          fileContent = await sharp(filePath).resize({ width: maxWidth }).png({ quality: 100 }).toBuffer();
          ContentType = mime.lookup(filePath) || "application/octet-stream";
        } else {
          fileContent = fs.readFileSync(filePath);
          ContentType = mime.lookup(filePath) || "application/octet-stream";
        }
      } catch (ee) {
        console.log("error reading file", ee);
        fileContent = fs.readFileSync(filePath);
      }

      // Upload main file — error propagates up so request fails cleanly
      await s3.send(new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: s3Key,
        Body: fileContent,
        ContentType: ContentType,
        ACL: "public-read",
      }));

      if (doThumbnail && isImage) {
        const lastSlashIndex = s3Key.lastIndexOf("/");
        if (lastSlashIndex !== -1) {
          thumbnailKey = s3Key.slice(0, lastSlashIndex + 1) + "thumbnail/" + s3Key.slice(lastSlashIndex + 1);
        }
        const thumbnailContent = await sharp(filePath).resize({ width: 100 }).png({ quality: 100 }).toBuffer();
        await s3.send(new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: thumbnailKey,
          Body: thumbnailContent,
          ContentType: "image/png",
          ACL: "public-read",
        }));
      }

      if (deleteFile) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }

      if (ogFilePath.length > 0) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: ogFilePath,
          }));
        } catch (error) {
          if (error.$metadata?.httpStatusCode !== 404) {
            console.log("Error deleting old object", error);
          }
        }
      }

      if (doThumbnail) {
        req.body = { ...req.body, [fieldName]: s3Key, [fieldName + "Thumbnail"]: thumbnailKey };
      } else {
        req.body = { ...req.body, [fieldName]: s3Key };
      }
    };

    try {
      await Promise.all(fieldNames.map(processField));
      next();
    } catch (error) {
      console.log("DO Spaces upload failed:", error.name, error.message);
      fieldNames.forEach((fieldName) => {
        const fp = req.body[fieldName];
        if (fp && typeof fp === "string" && fs.existsSync(fp)) {
          try { fs.unlinkSync(fp); } catch (_) {}
        }
      });
      return res.status(500).json({ success: false, message: "File upload to storage failed. Please try again." });
    }
  };
};


