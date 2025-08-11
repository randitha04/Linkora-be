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
    console.log('User data:', userData);

    const userProfile = createUserModel({
      uid,
      email: userData.email,
      degreeCard: userData.degreeCard,
      fullName: userData.name || userData.fullName,
      profile_state: userData.profile_state,
      userquality: userData.userquality,
      profilePicture: userData.profilePicture || "/Backend/assest/nopic.jpg",
      bannerImage: userData.bannerImage || "",
      relationshipState: userData.relationshipState || userData.relationshipStatus, 
      location: userData.location,
      joinDate: userData.joinDate,
      profileCompleteness: userData.profileCompleteness,
      
     socialPreferences: {
  workWithPeople: userData.socialPreferences?.workWithPeople || "",
  beAroundPeople: userData.socialPreferences?.beAroundPeople || "",
},


      university: userData.university || {
        name: userData.universityName || null,
        faculty: userData.facultyName || null,
        degree: userData.degreeName || null,
        positions: userData.positions || null,
        universityYear: userData.universityYear || null,
      },

    
      personality: {
        hobbies: userData.personality?.hobbies || [],
        interests: userData.personality?.interests || null,
        achievements: userData.personality?.achievements || [], 
        abilities: userData.personality?.abilities || [],
        skills: userData.personality?.skills || [],
        type: userData.personality?.type || "",
        whoAmI: userData.personality?.whoAmI || null,
      }, 
      activity: userData.activity || {
        posts: 0,
      },
    });

    console.log('User profile fetched:', userProfile);
    return res.status(200).json({
      message: "User profile fetched successfully",
      ...userProfile,
    });

  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message || "Unknown error",
    });
  }
};

const updateUserProfile = async (req, res) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: "Unauthorized: User ID not found in token" });
  }

  const uid = req.user.uid;

  const {
    fullName,
    degreeCard,
    profilePicture,
    bannerImage,
    relationshipState,
    profileCompleteness,
    university = {},
    personality = {},
    activity = {},
    socialPreferences = {},
    
  
  } = req.body;
 console.log('update profile', req.body);
  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload profilePicture if base64
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

    // Upload bannerImage if base64
    let finalBannerImage = userDoc.data().bannerImage || "";
    if (bannerImage?.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(bannerImage, {
        folder: "linkora/banner_images",
        public_id: `banner_${uid}`,
        overwrite: true,
      });
      finalBannerImage = uploadResult.secure_url;
    } else if (bannerImage?.startsWith("http")) {
      finalBannerImage = bannerImage;
    }

  const updateData = {
  uid: uid,  
  fullName: fullName || "",
  degreeCard: degreeCard || null,
  profilePicture: finalProfilePicture || null,
  bannerImage: finalBannerImage || null,                 
  profileCompleteness: profileCompleteness || 0,

  university: {
    name: university?.name || null,
    faculty: university?.faculty || null,
    degree: university?.degree || null,
    positions: university?.positions || null,
    universityYear: university?.universityYear || null,
  },

 
  relationshipState: relationshipState || null,

  personality: {
    hobbies: personality?.hobbies || [],
    interests: personality?.interests || null,
    achievements: personality?.achievements || null,
    abilities: personality?.abilities || null,
    skills: personality?.skills || [],
    type: personality?.type || "",
    whoAmI: personality?.whoAmI || null,
  },

  socialPreferences: {
    workWithPeople: socialPreferences?.workWithPeople || "",
    beAroundPeople: socialPreferences?.beAroundPeople || "",
  },

  activity: {
    posts: activity?.posts || 0,
    collaborations: activity?.collaborations || 0,
    connections: activity?.connections || 0,
  },

  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};


    await userRef.update(updateData);
    console.log('updatedata',updateData)

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
  const uid = req.user?.uid;

  console.log('use', uid);

  if (!uid) {
    return res.status(400).json({ message: "Missing UID in request." });
  }

  try {
    const db = require("firebase-admin").firestore();

    // Get current user doc to check profile_state
    const currentUserDoc = await db.collection("users").doc(uid).get();

    if (!currentUserDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentUserData = currentUserDoc.data();

    // If current user is banned, return empty list immediately
    if (currentUserData.profile_state === "Banned") {
      return res.status(200).json({ statuss: "Banned", message: "Banned" });
    }

    // Otherwise, fetch all users except self and only approved users
    const usersSnapshot = await db.collection("users").get();

    const allUsers = usersSnapshot.docs
      .map(doc => ({ uid: doc.id, ...doc.data() }))
      .filter(user => user.uid !== uid && user.profile_state === "Approved");

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
  console.log('getin')
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ message: "Friend UID is required" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    return res.status(200).json(userData);

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
