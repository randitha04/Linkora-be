const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Replace "your_jwt_secret" with your actual secret or use env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    if (!decoded || decoded.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized: Admin access required" });
    }

    // Optionally attach user info to req object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = adminMiddleware;
