
const axios = require('axios');

const { admin, db } = require('../config/firebaseConfig');

require('dotenv').config();


const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  console.log('Registering user...');

  
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email, name, and password are required" });
  }

  try {
    
    const existingUser = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({ 
        message: "User already registered. Please login." 
      });
    }

    
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });


    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      universityName: "",
      facultyName: "",
      degreeName: "",
      universityYear: "",
      relationshipState: "", 
      whoAmI: "",
      interests: "",
      achievements: "",
      abilities: "",
      role: "user",
      register_state: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('User registered successfully.');

    return res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
      email,
      name,
      role: "user",
      register_state: true,
      Approve_sate: true
    });

  } catch (error) {
    console.error("Firebase error:", error);
    return res.status(500).json({
      message: "Registration failed",
      error: error.message || "Unknown error"
    });
  }
};






const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
   
    const firebaseApiKey = process.env.FIREBASEAPIKEY;


    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const uid = response.data.localId;


    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found in database" });
    }

    const userData = userDoc.data();

   
    if (!userData.register_state) {
      return res.status(403).json({ message: "User is not registered/approved yet." });
    }

    return res.status(200).json({
      message: "Login successful",
      uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      register_state: userData.register_state,
      idToken: response.data.idToken,  
      refreshToken: response.data.refreshToken, 
    });

  } catch (error) {
 
    const errorMessage = error.response?.data?.error?.message || error.message || "Unknown error";

    console.error("Login error:", errorMessage);

    return res.status(401).json({
      message: "Login failed",
      error: errorMessage,
    });
  }
};



module.exports = { 
    loginUser,
    registerUser 
};
