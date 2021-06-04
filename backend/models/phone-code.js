const mongoose = require("mongoose");

const phoneCodeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    phoneVerificationCode: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("phoneCode", phoneCodeSchema);
