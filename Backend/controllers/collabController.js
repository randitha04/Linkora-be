const { db, admin } = require('../config/firebaseConfig');

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

    // Prepare updated fields
    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (tags) updatedData.tags = tags;
    if (users) updatedData.users = users;

    // Update in Firestore
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










module.exports = {
  createCollaboration,
  addUserToCollaboration,
  updateCollaboration
};
