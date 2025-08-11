const { admin } = require('../config/firebaseConfig');

const adminMiddleware = async (req, res, next) => {
  try {
    console.log("Identifying admin user...");

    // Get token from cookies
    const { admintoken } = req.cookies;
    console.log("Admin token found:", admintoken ? "Yes" : "No");

    if (!admintoken) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(admintoken);

    // Check custom claim for admin role
    if (!decodedToken.role || decodedToken.role !== "admin") {
      console.log("Unauthorized: Admin access required");
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    // Attach user info to request
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = adminMiddleware;
