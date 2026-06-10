const mongoose = require("mongoose");

const ExamRegistrationSchema = new mongoose.Schema(
  {
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      set: handleEmptyString,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    nameOfApplicant: {
      type: String,
    },
    address: {
      type: String,
    },
    pincode: {
      type: String,
    },
    age: {
      type: Number,
    },
    mobileNumber: {
      type: Number,
    },
    educationalQualification: {
      type: String,
    },
    feeDetails: {
      type: Number,
    },
    nameOfExamAppearingNow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamType",
      set: handleEmptyString,
    },
    status: {
      type: String,
      enum: ["Private", "Regular"],
    },
    centerRegistration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CenterRegistration",
      set: handleEmptyString,
    },
    examCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamCenterRegistration",
      set: handleEmptyString,
    },
    // The study centre (CenterRegistration) where this applicant will finally
    // write the exam. Defaults to their own study centre at submit time and is
    // re-resolved by the allocation algorithm (see controllers/examAllocation.js)
    // when clubbing thresholds require it. Kept separate from `centerRegistration`
    // so we never lose the student's home study centre.
    assignedExamCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CenterRegistration",
      set: handleEmptyString,
    },
    // True when the student's home centre was merged into another centre.
    // `assignedExamCenter` will differ from `centerRegistration` in that case.
    assignedByClubbing: {
      type: Boolean,
      default: false,
    },
    affiliation: {
      type: String,
    },
    whatsappNumber: {
      type: Number,
    },
    // hallTicketNumber: {
    //   type: String,
    // },
    regno: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    outsideCenter: {
      type: String,
      enum: ["Yes", "No"],
    },
    examDistrict: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      set: handleEmptyString,
    },
    outsideExamCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamCenterRegistration",
      set: handleEmptyString,
    },
    examName: {
      type: String,
      set: function (value) {
        // This will be set when nameOfExamAppearingNow is populated
        if (this.nameOfExamAppearingNow?.examType) {
          const parts = this.nameOfExamAppearingNow.examType.split(":");
          return parts[0]?.trim() || "";
        }
        return "";
      },
    },
    examSyllabus: {
      type: String,
      set: function (value) {
        // This will be set when nameOfExamAppearingNow is populated
        if (this.nameOfExamAppearingNow?.examType) {
          const parts = this.nameOfExamAppearingNow.examType.split(":");
          return parts[1]?.trim() || "";
        }
        return "";
      },
    },
  },
  { timestamps: true }
);

// Add a pre-save middleware to handle the splitting
ExamRegistrationSchema.pre("save", function (next) {
  if (this.nameOfExamAppearingNow?.examType) {
    const parts = this.nameOfExamAppearingNow.examType.split(":");
    this.examName = parts[0]?.trim() || "";
    this.examSyllabus = parts[1]?.trim() || "";
  }
  next();
});

// Add a post-findOne middleware to handle population
ExamRegistrationSchema.post("find", function (docs) {
  if (!Array.isArray(docs)) return;
  docs.forEach((doc) => {
    if (doc.nameOfExamAppearingNow?.examType) {
      const parts = doc.nameOfExamAppearingNow.examType.split(":");
      doc.examName = parts[0]?.trim() || "";
      doc.examSyllabus = parts[1]?.trim() || "";
    }
  });
});

// Function to convert empty strings to null
function handleEmptyString(value) {
  // If value is an empty string, return null
  if (value === "") {
    return null;
  }
  // Otherwise, return the original value
  return value;
}

module.exports = mongoose.model("ExamRegistration", ExamRegistrationSchema);
