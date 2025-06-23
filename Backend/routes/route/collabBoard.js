
const express = require("express");
const router = express.Router();

const collabController = require('../../userController/collabController');

// Create a new collaboration
router.post("/create-collabs", collabController.createCollaboration);

// Get all collaborations (placeholder, implement handler if needed)
router.get("/getAll-collabs", collabController. getAllCollaboration);

// Update a collaboration
router.put("/update-collabs/", collabController.updateCollaboration);

// Delete a collaboration (placeholder, implement handler if needed)
router.delete("/delete-Collab/", collabController.deleteCollaboration);

// // Respond to a collaboration (placeholder, implement handler if needed)
// router.post("/:id/respond", (req, res) => res.status(501).json({ message: "Not implemented" }));

module.exports = router;