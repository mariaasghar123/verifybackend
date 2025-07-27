const express = require("express");
const router = express.Router();
const User = require("../models/Document"); // Model ka path theek se check krna

// POST /api/user/verify-document
router.post("/verify-document", async (req, res) => {
  try {
    const { referenceNumber, passportNumber, name } = req.body;

    const user = await User.findOne({ referenceNumber, passportNumber });

    if (!user) {
      return res.status(404).json({ message: "No document found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
module.exports = router;
