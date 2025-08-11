
const axios = require('axios');
const { admin, db } = require('../config/firebaseConfig');
require('dotenv').config();

const { createUserModel } = require('../model/user');


const registerUser = async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  const userObject = req.body.userObject || {};

  // Destructure only top-level props (deep props go inside nested objects)
  const {
    uid,
    email,
    fullName,
    relationshipStatus,
    location,
    joinDate,
    profileCompleteness,
    profilePicture,
    degreeCard,
    bannerImage,
    university,   
    professional, 
    personality,   
    activity,     
    socialLinks,  
  } = userObject;
  console.log("Registering user with data:", userObject);
  // Basic validation
  if (!token || !uid || !email || !fullName || !university) {
    return res.status(400).json({ message: "Missing required data" });
  }

  try {
    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.uid !== uid) {
      return res.status(401).json({ message: "Invalid user ID in token" });
    }

    // Check for existing user
    const existingUser = await db.collection("users").doc(uid).get();
    if (existingUser.exists) {
      return res.status(409).json({ message: "User already registered" });
    }

    // Prepare user data using model
    const userData = createUserModel({
      uid,
      fullName,
      degreeCard,
      Gender:userObject.Gender,
      profilePicture,
      bannerImage,
      email,
      profileCompleteness,
      university,
      whoAmI: userObject.whoAmI,
      relationshipState: relationshipStatus,
      location,
      joinDate,
      personality,
      professional,
      socialPreferences: socialLinks, 
      activity,
    });

    // Add additional system-level metadata
    userData.role = "user";
    userData.register_state = true;
    userData.profile_state = "pending";
    userData.createdAt = admin.firestore.FieldValue.serverTimestamp();

    // Save user data in Firestore
    await db.collection("users").doc(uid).set(userData);

    // Set HttpOnly cookie with token
    res.cookie("idToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({ message: "User profile saved" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};




const loginUser = async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    //  Verify the ID token
    const decoded = await admin.auth().verifyIdToken(token);
    const { user_id} = decoded;

    //  Get user profile from Firestore
    const userDoc = await db.collection("users").doc(user_id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found in Firestore" });
    }

    const userData = userDoc.data();

    // Optional check: Only allow users who are approved
    if (!userData.register_state) {
      return res.status(403).json({ message: "User is not approved yet" });
    }
    
    //  Set secure cookies
    res.cookie("idToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",

    });

    //  Send back user data
    return res.status(200).json({
      message: "Login successful",
      user_id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      register_state: userData.register_state,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


const refreshToken = async (req, res) => {
  console.log("Refresh Token Requested from frontend");

  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Set new ID token as cookie
    res.cookie("idToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",


    });

    console.log(" Token updated successfully via frontend refresh.");
    return res.status(200).json({ message: "Token updated." });

  } catch (err) {
    console.error("Error verifying token:", err.message);

    res.clearCookie("idToken");
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};



module.exports = { 
    loginUser,
    registerUser,
    refreshToken
};
