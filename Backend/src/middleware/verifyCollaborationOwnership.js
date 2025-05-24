const { db } = require('../config/firebaseConfig');

const verifyCollaborationOwnership = async (req, res, next) => {
  const { collaborationId } = req.params;
  const userId = req.user?.uid; 

  if (!collaborationId || !userId) {
    return res.status(400).json({ message: "Collaboration ID and user must be provided." });
  }

  try {
    const collabRef = db.collection("collaborations").doc(collaborationId);
    const collabSnap = await collabRef.get();

    if (!collabSnap.exists) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    const collabData = collabSnap.data();

    if (collabData.createdBy !== userId) {
      return res.status(403).json({ message: "You are not authorized to modify this collaboration." });
    }

    next();

  } catch (error) {
    console.error("Ownership check error:", error);
    return res.status(500).json({
      message: "Failed to verify collaboration ownership.",
      error: error.message || "Unknown error",
    });
  }
};

module.exports = verifyCollaborationOwnership;
