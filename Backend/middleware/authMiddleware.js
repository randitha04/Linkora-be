const { admin } = require('../config/firebaseConfig');

const verifyFirebaseToken = async (req, res, next) => {
  const { idToken } = req.cookies;
  console.log('token',req.cookies);
  if (!idToken) {
    return res.status(401).json({ message: 'No token provided. Unauthorized.' });
  }



  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = { verifyFirebaseToken };
