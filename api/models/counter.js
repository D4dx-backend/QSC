const mongoose = require("mongoose");

// Atomic counter for generating per-center-per-year registration sequences.
// _id format: `${year}-${centerRegistrationId}`
const CounterSchema = new mongoose.Schema(
  {
    _id: { type: String },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

CounterSchema.statics.nextSeq = async function (key) {
  const doc = await this.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return doc.seq;
};

module.exports = mongoose.model("Counter", CounterSchema);
