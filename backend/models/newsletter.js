const mongoose = require("mongoose");

const newsletterSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model("Newsletter", newsletterSchema);
