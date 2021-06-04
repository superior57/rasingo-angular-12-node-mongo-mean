const mongoose = require("mongoose");

const passwordCodeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    passwordVerificationCode: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = mongoose.model("PasswordCode", passwordCodeSchema);
