const { db, admin } = require('../config/firebaseConfig');

// import or require your model function
const { createUserModel } = require("../model/user");  // adjust path as needed

const  cloudinary  = require("../utils/cloudinary");


const getUserProfile = async (req, res) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: "Unauthorized: User ID not found in token" });
  }

  try {
    const uid = req.user.uid;
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

   const userData = userDoc.data();
   




    // Use the model function to create a clean, normalized user object
    const userProfile = createUserModel({
      uid,
      email: userData.email,
      degreeCard: userData.degreeCard,
      fullName: userData.name || userData.fullName,
      profilePicture: userData.profilePicture || "/Backend/assest/nopic.jpg",
      relationshipState: userData.relationshipStatus,
      location: userData.location,
      joinDate: userData.joinDate,
      profileCompleteness: userData.profileCompleteness,

      university: userData.university || {
        name: userData.universityName,
        faculty: userData.facultyName,
        degree: userData.degreeName,
        positions: userData.positions || "",
        universityYear: userData.universityYear || ""
      },

      professional: userData.professional || {},

      personality: {
        hobbies: userData.personality?.hobbies || [],
        talents: userData.personality?.talents || [],
      },

      socialLinks: userData.socialLinks || {},

      activity: userData.activity || {},

      interests: userData.interests,
      achievements: userData.personality?.achievements || userData.achievements,
      abilities: userData.abilities,
      skills: userData.skills,
    })

    return res.status(200).json({
      message: "User profile fetched successfully",
      profile: userProfile,
    })
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message || "Unknown error",
    });
  }
}


const updateUserProfile = async (req, res) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: "Unauthorized: User ID not found in token" });
  }

  const uid = req.user.uid;

  const {
    nickname,
    fullName,
    degreeCard,
    profilePicture,
    relationshipState,
    location,
    profileCompleteness,
    university = {},
    professional = {},
    personality = {},
    socialLinks = {},
    activity = {}
  } = req.body;
  console.log(req.body)
  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    

     // Upload to Cloudinary if it's a base64 image
    let finalProfilePicture = userDoc.data().profilePicture || "/profile_Pic/nopic.jpg";

    if (profilePicture?.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(profilePicture, {
        folder: "linkora/profile_photos",
        public_id: `user_${uid}`,
        overwrite: true,
      });
      finalProfilePicture = uploadResult.secure_url;
    } else if (profilePicture?.startsWith("http")) {
      finalProfilePicture = profilePicture;
    }
  

    const updateData = {
      nickname: nickname || "",
      name: fullName || "",
      degreeCard: degreeCard || "",
      profilePicture: finalProfilePicture ,
      relationshipStatus: relationshipState || "",
      location: location || "",
      profileCompleteness: profileCompleteness || 0,

      university: {
        name: university.name || "",
        faculty: university.faculty || "",
        degree: university.degree || "",
        positions: university.positions || "",
        universityYear: university.universityYear || ""

      },

      professional: {
        currentJobs: professional.currentJobs || "",
        societyPositions: professional.societyPositions || "",
        workWithPeople: professional.workWithPeople || "",
        beAroundPeople: professional.beAroundPeople || ""
      },

      personality: {
        hobbies: personality.hobbies || [],
        talents: personality.talents || [],
        achievements: personality.achievements || ""
      },

      socialLinks: {
        website: socialLinks.website || "",
        github: socialLinks.github || "",
        linkedin: socialLinks.linkedin || "",
        twitter: socialLinks.twitter || "",
        instagram: socialLinks.instagram || ""
      },

      activity: {
        posts: activity.posts || 0,
        collaborations: activity.collaborations || 0,
        connections: activity.connections || 0
      },

      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.update(updateData);

    return res.status(200).json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message || "Unknown error"
    });
  }
};


const deleteUserProfile = async (req, res) => {
  const { uid } = req.query;

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
  const { fromUid, toUid } = req.body;

  if (!fromUid || !toUid) {
    return res.status(400).json({ message: "Both fromUid and toUid are required" });
  }

  try {

    const requestSnapshot = await db.collection("Friends")
      .where("fromUid", "==", fromUid)
      .where("toUid", "==", toUid)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (requestSnapshot.empty) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const requestDoc = requestSnapshot.docs[0];


    await requestDoc.ref.update({
      status: "accepted"
    });

    return res.status(200).json({ message: "Friend request accepted" });

  } catch (error) {
    console.error("Accept request error:", error);
    return res.status(500).json({ message: "Failed to accept request", error: error.message });
  }
};


const getFriends = async (req, res) => {
  const uid = req.user?.uid; // make sure user is coming from auth middleware

  console.log('use', uid);

  if (!uid) {
    return res.status(400).json({ message: "Missing UID in request." });
  }

  try {
    const usersSnapshot = await db.collection("users").get();

    const allUsers = usersSnapshot.docs
      .map(doc => ({ uid: doc.id, ...doc.data() }))
      .filter(user => user.uid !== uid); // ✅ exclude current user

    return res.status(200).json({ friends: allUsers });

  } catch (error) {
    console.error("Fetch users error:", error);
    return res.status(500).json({ message: "Error fetching users", error: error.message });
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

const getFriendProfile = async (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ message: "Friend UID is required" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    return res.status(200).json({ profile: userData });

  } catch (error) {
    console.error("Error fetching friend profile:", error);
    return res.status(500).json({ message: "Error fetching friend profile", error: error.message });
  }
};




module.exports = {
  updateUserProfile, deleteUserProfile, 
  sendFriendRequest, acceptFriendRequest,
  getFriends, getFriendSuggestions, getUserProfile, getFriendProfile
}
