
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const pendinguser = async (req, res, next) => {
  try {
    console.log("Fetching pending users...");
    const db = require("firebase-admin").firestore();
    const snapshot = await db.collection("users").get();

    if (snapshot.empty) {
      console.log("No pending users found.");
      return res.status(200).json({
        success: true,
        data: [],
        totalPages: 1,
        totalCount: 0,
      });
    }

    const pendingUsers = [];
    snapshot.forEach(doc => {
      pendingUsers.push({ id: doc.id, ...doc.data() });
    });

    // For pagination, calculate totalCount and totalPages (assuming 20 per page)
    const totalCount = pendingUsers.length;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(totalCount / limit);

    // Paginate the users array
    const paginatedUsers = pendingUsers.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data: paginatedUsers,
      totalPages,
      totalCount,
    });

    console.log(`Pending users fetched successfully: ${paginatedUsers.length} users on page ${page}`);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const userState = async (req, res, next) => {
  try {
    console.log("Updating user state...");
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

    await userRef.update({ profile_state: statedata });

    return res.status(200).json({
      success: true,
      message: "User profile_state updated successfully",
      state: statedata
    });  } catch (error) {
    console.error("Error updating user state:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const dashboard = async (req, res, next) => {
  try {
    console.log("Fetching dashboard data...");

    const usersRef = db.collection("users");

    // Get all users except banned
    const snapshot = await usersRef
      .where("profile_state", "!=", "Banned")
      .get();

    if (snapshot.empty) {
      return res.json({
        userCount: 0,
        gender: [],
        year: [],
        skills: [],
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

    let skillsMap = {};

    snapshot.forEach((doc) => {
      const user = doc.data();

      // Count users
      totalUsers++;

      // Gender count
      if (user.gender === "male") maleCount++;
      else if (user.gender === "female") femaleCount++;

      // Year count
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

      // Skills count (assuming user.skills is an array of strings)
      if (Array.isArray(user.skills)) {
        user.skills.forEach((skill) => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1;
        });
      }
    });

    // Format gender data for PercentageBar
    const genderData = [
      { label: "Male", value: maleCount, color: "#3B82F6" },
      { label: "Female", value: femaleCount, color: "#EF4444" },
    ];

    // Format year data for PercentageBar
    const yearData = [
      { label: "Year 1", value: universityYearCounts.year1, color: "#10B981" },
      { label: "Year 2", value: universityYearCounts.year2, color: "#F59E0B" },
      { label: "Year 3", value: universityYearCounts.year3, color: "#8B5CF6" },
      { label: "Year 4", value: universityYearCounts.year4, color: "#EC4899" },
    ];

    // Format skills data for BarChart
    const skillsData = Object.entries(skillsMap).map(([name, count]) => ({
      name,
      count,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16), // random color
    }));

    return res.json({
      userCount: totalUsers,
      gender: genderData,
      year: yearData,
      skills: skillsData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



const getReportedUsers = async (req, res, next) => {
  try {
    const db = require("firebase-admin").firestore();

    // Fetch all documents from reportedUsers collection
    const reportsSnapshot = await db.collection("reportedUsers").get();

    // Extract data and add doc id as well
    const reports = reportsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(reports);
  } catch (error) {
    console.error("Error fetching reported users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resolveReport = async (req, res, next) => {
  try {
    console.log("Resolving report...");
    const db = require("firebase-admin").firestore();
    const { userId, reportId } = req.body;

    if (!userId || !reportId) {
      return res.status(400).json({ error: "userId and reportId are required" });
    }

    // Update user document
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.update({
      profile_state: "Approved",
      userquality: "Good",
    });

    // Delete the report document
    const reportRef = db.collection("reportedUsers").doc(reportId);
    const reportDoc = await reportRef.get();

    if (!reportDoc.exists) {
      return res.status(404).json({ error: "Report not found" });
    }

    await reportRef.delete();
   console.log("User status updated and report deleted successfully");
    res.json({ message: "User status updated and report deleted successfully" });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveReportAndDeleteUser = async (req, res, next) => {
  try {
    const db = require("firebase-admin").firestore();
    const { userId, reportId } = req.body;

    if (!userId || !reportId) {
      return res.status(400).json({ error: "userId and reportId are required" });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user document
    await userRef.delete();

    const reportRef = db.collection("reportedUsers").doc(reportId);
    const reportDoc = await reportRef.get();

    if (!reportDoc.exists) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Delete the report document
    await reportRef.delete();

    res.json({ message: "User and report deleted successfully" });
  } catch (error) {
    console.error("Error deleting user and report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






module.exports = {
  pendinguser,
  userState,
  dashboard,
  getReportedUsers,
  resolveReport,
  approveReportAndDeleteUser
};




