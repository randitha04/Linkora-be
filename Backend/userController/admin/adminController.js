
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

//user controller for admin operations
const pendinguser = async (req, res, next) => {
  try {
    const db = require("firebase-admin").firestore();
    const snapshot = await db.collection("users").where("register_state", "==", "pending").get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const pendingUsers = [];
    snapshot.forEach(doc => {
      pendingUsers.push({ id: doc.id, ...doc.data() });
    });

    res.json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const userState = async (req, res, next) => {
  try {
    const db = require("firebase-admin").firestore();
    const { uid, statedata } = req.body;

    if (!uid || !statedata) {
      return res.status(400).json({ error: "uid and statedata are required" });
    }

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.update({ register_state: statedata });

    res.json({ message: "User register_state updated successfully" });
  } catch (error) {
    console.error("Error updating user state:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const dashboard = async (req, res, next) => {
  try {
    const usersRef = db.collection("users");

    // Query users excluding state='pending' and userquality='bad'
    // Firestore doesn't support NOT operator, so we need to filter client-side or use multiple queries.

    // Option 1: Get all users where state != pending and userquality != bad
    // Firestore supports '!=' for a single field, but not multiple != in one query easily.
    // We'll query state != 'pending' first, then filter userquality != 'bad' client-side.

    const snapshot = await usersRef.where("register_state", "!=", "pending").get();

    if (snapshot.empty) {
      return res.json({
        totalUsers: 0,
        maleCount: 0,
        femaleCount: 0,
        universityYearCounts: {
          year1: 0,
          year2: 0,
          year3: 0,
          year4: 0,
        },
      });
    }

    let totalUsers = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let universityYearCounts = {
      year1: 0,
      year2: 0,
      year3: 0,
      year4: 0,
    };

    snapshot.forEach((doc) => {
      const user = doc.data();

      if (user.userquality === "bad") return; 

      totalUsers++;

      if (user.gender === "male") maleCount++;
      else if (user.gender === "female") femaleCount++;

      switch (user.universityYear) {
        case 1:
          universityYearCounts.year1++;
          break;
        case 2:
          universityYearCounts.year2++;
          break;
        case 3:
          universityYearCounts.year3++;
          break;
        case 4:
          universityYearCounts.year4++;
          break;
      }
    });

    return res.json({
      totalUsers,
      maleCount,
      femaleCount,
      universityYearCounts,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const reportuser = async (req, res, next) => {
  try {
    const db = require("firebase-admin").firestore();
    const { uid, userquality } = req.body;

    if (!uid || !userquality) {
      return res.status(400).json({ error: "uid and userquality are required" });
    }

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.update({ userquality });

    res.json({ message: "User quality updated successfully" });
  } catch (error) {
    console.error("Error updating user quality:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports = {
  pendinguser,
  userState,
  dashboard,
  reportuser
};




