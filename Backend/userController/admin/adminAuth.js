const { adminAuth } = require("./../../config/firebaseConfig");

async function adminLogin(req, res) {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ success: false, message: "No token provided" });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const role = decodedToken.role || decodedToken.claims?.role || "user";

    res.json({ success: true, role, uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = { adminLogin };
