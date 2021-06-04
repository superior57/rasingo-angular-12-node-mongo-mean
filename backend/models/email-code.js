const mongoose = require("mongoose");

const emailCodeSchema = mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    emailVerificationCode: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = mongoose.model("Code", emailCodeSchema);
