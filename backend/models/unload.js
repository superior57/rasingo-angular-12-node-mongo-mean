const mongoose = require("mongoose");

const unLoadSchema = mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  countryCode: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true},
  cargoId: { type: mongoose.Schema.Types.ObjectId, ref: "Cargo", required: true }
});

module.exports = mongoose.model("UnLoad", unLoadSchema);
