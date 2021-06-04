const mongoose = require("mongoose");

const cargoSchema = mongoose.Schema({
  description: { type: String },
  cargoType: { type: String, enum:[
    'adr',/* c*/
    'refrigerated',
    'ind_liq',/* c*/
    'food_liq',/* c*/
    'ind_bulk',/* c*/
    'food_bulk',/* c*/
    'special',
    'container',
    'not_palletized',
    'palletized',
    'vehicles',
    'special_lenghts',
    'special_heights',
    'hang',
    'animals',/* c*/
    'other'
  ], required: true },
  price: { type: Number, required: true },
  height: { type: Number },
  width: { type: Number },
  clength: { type: Number },
  weight: { type: Number },
  date: { type: Date, required:true },
  container: { type: String, enum:[
    'standard_20',
    'standard_40',
    'high_cube_40',
    'open_top_40',
    'frigo_20',
    'frigo_40',
    'flat_rack_20',
    'flat_rack_40',
    'platform_20',
    'platform_40',
    'other'
  ]},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Cargo", cargoSchema);
