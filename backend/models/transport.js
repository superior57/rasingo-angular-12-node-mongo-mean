const mongoose = require("mongoose");

const transportSchema = mongoose.Schema({
  //transportDate: { type: Date, required:true },
  no: { type: Number, required: true },
  placekg: { type: String, enum:[
    'fpp',
    'kg'
  ], required: true },
  start: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  truckId: { type: mongoose.Schema.Types.ObjectId, ref: "Truck", required: true }
});

module.exports = mongoose.model("Transport", transportSchema);
