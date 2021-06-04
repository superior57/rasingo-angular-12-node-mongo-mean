const mongoose = require("mongoose");

const invitationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    inviteCode: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model("Invitation", invitationSchema);
