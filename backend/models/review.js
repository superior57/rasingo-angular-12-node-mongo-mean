const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  review: { type: String, required: true },
  stars: { type: Number, required: true },
  date: { type: Date, required:true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Review", reviewSchema);
