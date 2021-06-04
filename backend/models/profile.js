const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverPhoto: { type: String },
  profilePhoto: { type: String },
  about: { type: String },
  web: { type: String },
  employees: { type: Number },
  year: { type: Number },
  workingHours: { type: String }
});

module.exports = mongoose.model("Profile", profileSchema);
