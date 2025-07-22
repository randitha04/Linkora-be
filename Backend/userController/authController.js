
const axios = require('axios');
const { admin, db } = require('../config/firebaseConfig');
require('dotenv').config();

const { createUserModel } = require('../model/user');


const registerUser = async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  const {
    uid,
    email,
    fullName,
    nickname,
    relationshipStatus,
    location,
    joinDate,
    profileCompleteness,
    university,
    professional,
    personality,
    socialLinks,
    activity,
    universityName,
    facultyName,
    degreeName,
    universityYear,
    whoAmI,
    interests,
    achievements,
    abilities,
    skills,
    profilePicture,
  } = req.body.userObject;

  // Input Validation
  console.log(req.body.userObject);
  if (!token || !uid || !email || !fullName || !university) {
    return res.status(400).json({ message: "Missing required data" });
  }

  try {
    // Verify Firebase ID Token
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.uid !== uid) {
      return res.status(401).json({ message: "Invalid user ID in token" });
    }

    // Check if user already exists
    const existingUser = await db.collection("users").doc(uid).get();
    if (existingUser.exists) {
      return res.status(409).json({ message: "User already registered" });
    }

    // Prepare user object using model
    const userData = createUserModel({
      uid,
      fullName,
      nickname,
      email,
      profileCompleteness,
      university,
      universityName,
      facultyName,
      degreeName,
      universityYear,
      whoAmI,
      relationshipState: relationshipStatus,
      location,
      joinDate,
      personality,
      professional,
      socialLinks,
      activity,
      interests,
      achievements,
      abilities,
      skills,
      profilePicture,
    });

    // Add system-level metadata
    userData.role = "user";
    userData.register_state = true;
    userData.profile_state = "pending";
    userData.createdAt = admin.firestore.FieldValue.serverTimestamp();

    // Save to Firestore
    await db.collection("users").doc(uid).set(userData);
    console.log("User registered in Firestore");

    // Set HttpOnly Cookie
    res.cookie("idToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
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
  // To read cookies from the request, you need to use the cookie-parser middleware.
  // I'll explain how to add it in the next step.
  const token = req.cookies.idToken;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token not found in cookies.' });
  }

  try {
    const firebaseApiKey = process.env.FIREBASEAPIKEY;
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}`,
      {
        grant_type: 'refresh_token',
        refresh_token: token,
      }
    );

    const { id_token: newIdToken } = response.data;
    console.log('refreshed token')

    res.cookie('idToken', newIdToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Token refreshed successfully.' });
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
    console.error('Token refresh error:', errorMessage);

    // Clear potentially invalid cookies
    res.clearCookie('refreshToken');
    res.clearCookie('idToken');

    return res.status(401).json({
      message: 'Failed to refresh token. Please log in again.',
      error: errorMessage,
    });
  }
};


module.exports = { 
    loginUser,
    registerUser,
    refreshToken
};
