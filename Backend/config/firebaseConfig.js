const admin = require("firebase-admin");

const serviceAccountJSON = Buffer.from(
  process.env.FIREBASE_KEY_BASE64,
  "base64"
).toString("utf8");

const serviceAccount = JSON.parse(serviceAccountJSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
