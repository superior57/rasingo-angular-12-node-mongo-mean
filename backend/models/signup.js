const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cargoId: { type: mongoose.Schema.Types.ObjectId, ref: "Cargo", required: true },
  truckId: { type: mongoose.Schema.Types.ObjectId, ref: "Truck", required: true },
  approved: { type: Boolean ,required: true },
  finished: { type: Boolean ,required: true },
});

module.exports = mongoose.model("Signup", signupSchema);
