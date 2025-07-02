const { db, admin } = require('../config/firebaseConfig');



const getAllCollaborations = async (req, res) => {
  try {
    const collaborationsSnapshot = await db.collection("collaborations").get();

    if (collaborationsSnapshot.empty) {
      return res.status(200).json({
        message: "No collaborations found.",
        collaborations: [],
      });
    }

    const collaborations = collaborationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      message: "Collaborations fetched successfully.",
      collaborations,
    });

  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return res.status(500).json({
      message: "Failed to fetch collaborations.",
      error: error.message || "Unknown error",
    });
  }
};

const createCollaboration = async (req, res) => {
  const {uid, title, description, tags, createdBy, users } = req.body;


  if (!title || !description || !createdBy) {
    return res.status(400).json({
      message: "Title, description, and creator ID are required.",
    });
  }

  try {
  
    const collaboration = {
        uid,
      title,
      description,
      tags: tags || [],
      createdBy,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      users: users || [], 
    };

    const docRef = await db.collection("collaborations").add(collaboration);

    return res.status(201).json({
      message: "Collaboration created successfully.",
      collaborationId: docRef.id,
    });

  } catch (error) {
    console.error("Error creating collaboration:", error);
    return res.status(500).json({
      message: "Failed to create collaboration.",
      error: error.message || "Unknown error",
    });
  }
};



const updateCollaboration = async (req, res) => {
  const { collaborationId } = req.params;
  const { title, description, tags, users } = req.body;

  if (!collaborationId) {
    return res.status(400).json({ message: "Collaboration ID is required." });
  }

  try {
    const collabRef = db.collection("collaborations").doc(collaborationId);
    const collabSnap = await collabRef.get();

    if (!collabSnap.exists) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (tags) updatedData.tags = tags;
    if (users) updatedData.users = users;


    await collabRef.update(updatedData);

    return res.status(200).json({
      message: "Collaboration updated successfully.",
    });

  } catch (error) {
    console.error("Error updating collaboration:", error);
    return res.status(500).json({
      message: "Failed to update collaboration.",
      error: error.message || "Unknown error",
    });
  }
};



const addUserToCollaboration = async (req, res) => {
  const { collaborationId, user } = req.body;

  if (!collaborationId || !user || !user.uid || !user.name) {
    return res.status(400).json({
      message: "collaborationId and user object with uid and name are required.",
    });
  }

  try {
    const collabRef = db.collection("collaborations").doc(collaborationId);
    const collabDoc = await collabRef.get();

    if (!collabDoc.exists) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    const existingUsers = collabDoc.data().users || [];


    const alreadyAdded = existingUsers.some(u => u.uid === user.uid);
    if (alreadyAdded) {
      return res.status(400).json({ message: "User already in collaboration" });
    }

   
    await collabRef.update({
      users: admin.firestore.FieldValue.arrayUnion(user),
    });

    return res.status(200).json({
      message: "User added to collaboration",
      user,
    });

  } catch (error) {
    console.error("Error adding user to collaboration:", error);
    return res.status(500).json({
      message: "Failed to add user",
      error: error.message || "Unknown error",
    });
  }
};

const deleteCollaboration = async (req, res) => {
  const { collaborationId } = req.params;

  if (!collaborationId) {
    return res.status(400).json({ message: "Collaboration ID is required." });
  }

  try {
    const collabRef = db.collection("collaborations").doc(collaborationId);
    const doc = await collabRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    await collabRef.delete();

    return res.status(200).json({
      message: "Collaboration deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting collaboration:", error);
    return res.status(500).json({
      message: "Failed to delete collaboration.",
      error: error.message || "Unknown error",
    });
  }
};


const respondToCollaboration = async (req, res) => {
  const { collaborationId } = req.params;
  const { userId, response } = req.body; 

  if (!userId || !response) {
    return res.status(400).json({ message: "User ID and response are required." });
  }

  if (!['accepted', 'declined'].includes(response)) {
    return res.status(400).json({ message: "Invalid response. Must be 'accepted' or 'declined'." });
  }

  try {
    const collabRef = db.collection("collaborations").doc(collaborationId);
    const collabDoc = await collabRef.get();

    if (!collabDoc.exists) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    const collaborationData = collabDoc.data();
    const users = collaborationData.users || [];

    const userIndex = users.findIndex(u => u.uid === userId && u.status === 'pending');

    if (userIndex === -1) {
      return res.status(404).json({ message: "Pending invitation for this user not found." });
    }

    if (response === 'accepted') {
      users[userIndex].status = 'accepted';
    } else { // 'declined'
      // Remove the user from the array if they decline
      users.splice(userIndex, 1);
    }

    await collabRef.update({ users });

    return res.status(200).json({
      message: `Collaboration invitation ${response} successfully.`,
    });
  } catch (error) {
    console.error("Error responding to collaboration:", error);
    return res.status(500).json({
      message: "Failed to respond to collaboration.",
      error: error.message || "Unknown error",
    });
  }
};


module.exports = {
  createCollaboration,
  addUserToCollaboration,
  updateCollaboration,
  getAllCollaborations,
  deleteCollaboration,
  respondToCollaboration,
};
