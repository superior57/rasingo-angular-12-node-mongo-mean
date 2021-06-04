const mongoose = require("mongoose");

const truckSchema = mongoose.Schema({
  truckModel: { type: String, required: true },
  truckType: { type: String, enum:[
    'truck_adr',
    'cistern_ind_liq',
    'cistern_food_liq',
    'truck_refrigerated',
    'truck',
    'truck_van_hang',
    'truck_half_trailer',
    'truck_trailer',
    'truck_special',
    'truck_container',
    'truck_vehicles',
    'truck_animals',
    'truck_tipper',
    'truck_food_bulk',
    'combi',
    'caddy'
  ],
  required: true },
  year: { type: String, required: true },
  regNumber: { type: String, required: true },
  regDate: { type: Date, required: true },
  maxWeight: { type: Number, required: true },
  euroNorm: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  tlength: { type: Number },
  hydraulicRamp: { type: Boolean },
  crane: { type: Boolean },
  winches: { type: Boolean },
  adjustableRoof: { type: Boolean },
  movableFloor: { type: Boolean },
  movableTarpaulin: { type: Boolean },
  rotatingSignalLight: { type: Boolean },
  containerLifter: { type: Boolean },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  TLic: { type: String },
  Lic: { type: String },
  CMRLic: { type: String },
  approved: { type: Boolean },
  used: { type: Boolean }
});

module.exports = mongoose.model("Truck", truckSchema);
