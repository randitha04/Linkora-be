const express = require("express");
const router = express.Router();

const profileController = require('../../controllers/profileController');

// Get user profile
router.get("/:uid", profileController.getProfile);

// Update user profile
router.put("/:uid", profileController.updateProfile);

// Create user profile
router.post("/", profileController.createProfile);

// Delete user profile
router.delete("/:uid", profileController.deleteProfile);

module.exports = router;