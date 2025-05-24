
const updateUserProfile = async (req, res) => {
  const {
    uid, 
    universityName,
    facultyName,
    degreeName,
    universityYear,
    relationshipState, 
    whoAmI,
    interests,
    achievements,
    abilities,
  } = req.body;

  if (!uid) {
    return res.status(400).json({ message: "User ID (uid) is required" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    await userRef.update({
      universityName: universityName || "",
      facultyName: facultyName || "",
      degreeName: degreeName || "",
      universityYear: universityYear || "",
      relationshipState: relationshipState || "",
      whoAmI: whoAmI || "",
      interests: interests || "",
      achievements: achievements || "",
      abilities: abilities || "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message || "Unknown error",
    });
  }
};


const deleteUserProfile = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: "User ID (uid) is required" });
  }

  try {
    // Delete Firestore user data
    await db.collection("users").doc(uid).delete();

    // Delete Firebase Authentication user
    await admin.auth().deleteUser(uid);

    console.log(`User ${uid} deleted successfully.`);

    return res.status(200).json({
      message: "User profile and authentication deleted successfully",
    });

  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      message: "Failed to delete user profile",
      error: error.message || "Unknown error",
    });
  }
};


const sendFriendRequest = async (req, res) => {
  const { fromUid, toUid } = req.body;

  if (!fromUid || !toUid || fromUid === toUid) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    // Check for existing relationship (both ways)
    const checkExisting = await db.collection("Friends")
      .where("fromUid", "in", [fromUid, toUid])
      .where("toUid", "in", [fromUid, toUid])
      .get();

    if (!checkExisting.empty) {
      return res.status(409).json({ message: "Friend request already exists or already friends" });
    }

    // Add friend request
    await db.collection("Friends").add({
      fromUid,
      toUid,
      status: "pending",
      createdAt: new Date()
    });

    return res.status(201).json({ message: "Friend request sent" });

  } catch (error) {
    console.error("Send request error:", error);
    return res.status(500).json({ message: "Error sending request", error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: "Request ID required" });
  }

  try {
    await db.collection("Friends").doc(requestId).update({
      status: "accepted"
    });

    return res.status(200).json({ message: "Friend request accepted" });

  } catch (error) {
    console.error("Accept request error:", error);
    return res.status(500).json({ message: "Failed to accept request", error: error.message });
  }
};

const getFriends = async (req, res) => {
  const { uid } = req.params;

  try {
    const friendsSnapshot = await db.collection("Friends")
      .where("status", "==", "accepted")
      .where("fromUid", "in", [uid])
      .get();

    const reverseFriendsSnapshot = await db.collection("Friends")
      .where("status", "==", "accepted")
      .where("toUid", "in", [uid])
      .get();

    const friends = [
      ...friendsSnapshot.docs.map(doc => doc.data()),
      ...reverseFriendsSnapshot.docs.map(doc => doc.data())
    ];

    return res.status(200).json({ friends });

  } catch (error) {
    console.error("Fetch friends error:", error);
    return res.status(500).json({ message: "Error fetching friends", error: error.message });
  }
};


const getFriendSuggestions = async (req, res) => {
  const { uid } = req.params;

  try {
    // 1. Get logged-in user's profile
    const currentUserDoc = await db.collection("users").doc(uid).get();
    if (!currentUserDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = currentUserDoc.data();

    // 2. Get list of current friends
    const friendDocs = await db.collection("Friends")
      .where("status", "==", "accepted")
      .where("fromUid", "==", uid)
      .get();

    const reverseFriends = await db.collection("Friends")
      .where("status", "==", "accepted")
      .where("toUid", "==", uid)
      .get();

    const friendUIDs = new Set([
      ...friendDocs.docs.map(doc => doc.data().toUid),
      ...reverseFriends.docs.map(doc => doc.data().fromUid),
      uid, // Exclude self
    ]);

    // 3. Get all users from Firestore
    const usersSnap = await db.collection("users").get();

    const suggestions = [];

    usersSnap.forEach(doc => {
      const user = doc.data();
      const userId = doc.id;

      if (!friendUIDs.has(userId)) {
        // Match logic
        let score = 0;

        if (user.university === currentUser.university) score += 2;
        if (user.faculty === currentUser.faculty) score += 2;
        if (user.degree === currentUser.degree) score += 1;
        if (user.year === currentUser.year) score += 1;

        if (Array.isArray(user.interests) && Array.isArray(currentUser.interests)) {
          const commonInterests = user.interests.filter(interest =>
            currentUser.interests.includes(interest)
          );
          score += commonInterests.length; // +1 per common interest
        }

        if (score > 0) {
          suggestions.push({ uid: userId, ...user, score });
        }
      }
    });

    // 4. Sort by score (highest similarity first)
    suggestions.sort((a, b) => b.score - a.score);

    res.status(200).json({ suggestions });

  } catch (error) {
    console.error("Friend suggestion error:", error);
    res.status(500).json({ message: "Error fetching friend suggestions", error: error.message });
  }
};






