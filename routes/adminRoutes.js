// routes/adminRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Document = require("../models/Document");

const router = express.Router();

// File storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowed = ["application/pdf", "image/jpeg", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and JPG allowed"));
    }
  },
});

// Admin can upload document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, passportNumber, referenceNumber } = req.body;
    const file = req.file ? req.file.filename : undefined;

    const newDoc = new Document({
      name,
      passportNumber,
      referenceNumber,
      file,
    });
    await newDoc.save();
    res.status(201).json({ message: "Document uploaded successfully." });
  } catch (err) {
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

router.get("/", async (req, res) => {
  const docs = await Document.find();
  console.log(docs);
  res.json(docs);
});
// DELETE document by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const document = await Document.findByIdAndDelete(id); // Replace Document with your model name

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Optionally, delete file from /uploads folder too
    const fs = require("fs");
    const filePath = `uploads/${document.file}`; // adjust according to your DB field
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
