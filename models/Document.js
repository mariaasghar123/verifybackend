// models/Document.js
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: { type: String },
  passportNumber: String,
  referenceNumber: { type: String, unique: true },
  file: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Document", documentSchema);
