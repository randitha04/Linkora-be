const { adminAuth } = require("./../../config/firebaseConfig");
const cookie = require("cookie");

async function adminLogin(req, res) {
  // Extract token from Authorization header "Bearer <token>"
  const authHeader = req.headers.authorization || "";
  const tokenMatch = authHeader.match(/^Bearer (.+)$/);
  if (!tokenMatch) {
    return res.status(400).json({ success: false, message: "No token provided in Authorization header" });
  }
  const idToken = tokenMatch[1];
 console.log("Admin login attempt with token:", idToken);
  try {
    console.log("Verifying admin token...");
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const role = decodedToken.role || decodedToken.claims?.role || "user";

    // Set HTTP-only cookie with token, name: "admintoken"
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("admintoken", idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
        sameSite: "None"
      })
    );

    return res.json({ success: true, role, uid: decodedToken.uid });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}





async function adminRefreshToken(req, res) {
  console.log("Admin refresh token request from dashboard...");

  // Extract token from Authorization header
  const authHeader = req.headers.authorization || "";
  const tokenMatch = authHeader.match(/^Bearer (.+)$/);
  if (!tokenMatch) {
    return res.status(400).json({
      success: false,
      message: "No token provided in Authorization header",
    });
  }
  const idToken = tokenMatch[1];

  try {
    console.log("Verifying admin token...");
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const role = decodedToken.role || decodedToken.claims?.role || "user";

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not an admin.",
      });
    }

    // Set HTTP-only cookie with refreshed token
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("admintoken", idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "None"
      })
    );

    console.log("Admin token refreshed successfully.");
    return res.status(200).json({
      success: true,
      message: "Admin token refreshed",
      role,
      uid: decodedToken.uid,
    });
  } catch (error) {
    console.error("Error verifying admin token:", error.message);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("admintoken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
        sameSite: "None",
      })
    );
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = { adminLogin , adminRefreshToken };
