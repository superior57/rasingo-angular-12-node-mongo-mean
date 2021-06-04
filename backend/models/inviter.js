const mongoose = require("mongoose");

const inviterSchema = mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    childId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model("Inviter", inviterSchema);
