const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean },
  registrationStep: { type: Number, enum: [0,1,2,3]},
  regDate: { type: Date },
  companyName: { type: String },
  taxNo: { type: String },
  dialCode: { type: String },
  telephone: { type: String },
  isTelephoneVerified: { type: Boolean },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },
  userType: { type: String, enum:['firms','drivers','both']},
  approved: { type: Boolean },
  isAdmin: { type: Boolean },
  isProfileCompleted: { type: Boolean },
  inviteMonths: {type: Number}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
