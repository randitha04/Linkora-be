const express = require("express");
const router = express.Router();

const authController = require('../../controllers/authController');

// Register with email/password
router.post("/signup", authController.registerUser);
router.post("/login", authController.loginUser);

// Signout (optional: client-side mostly)
router.post("/signout", (req, res) => {
  // Firebase handles signout client-side, but you can invalidate token or just respond
  res.status(200).json({ message: 'Signout handled on client side.' });
});

// Get current user (requires middleware)
router.get("/user", (req, res) => {
  res.status(200).json({ message: 'Fetch current user logic goes here.' });
});

// Update user profile (requires middleware)
router.put("/update-profile", (req, res) => {
  res.status(200).json({ message: 'Update profile logic goes here.' });
});

module.exports = router;
