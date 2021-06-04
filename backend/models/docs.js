const mongoose = require("mongoose");

const cmrSchema = mongoose.Schema({
  docsFileName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  docType: { type: String, enum:['isr','lmp','pocmr','pr'], required: true }
});

module.exports = mongoose.model("CMR", cmrSchema);
