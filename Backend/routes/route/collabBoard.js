
const express = require("express");
const router = express.Router();

const collabController = require('../../userController/collabController');

// Create a new collaboration
router.post("/", collabController.createCollaboration);

// Get all collaborations
router.get("/", collabController.getAllCollaborations);

// Add a user to a collaboration
router.post("/add-user", collabController.addUserToCollaboration);

// Update a collaboration
router.put("/:collaborationId", collabController.updateCollaboration);

// Delete a collaboration
router.delete("/:collaborationId", collabController.deleteCollaboration);

// Respond to a collaboration
router.post("/:collaborationId/respond", collabController.respondToCollaboration);

module.exports = router;