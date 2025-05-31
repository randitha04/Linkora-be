
var admin = require("firebase-admin");

var serviceAccount = require("./Service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});

const db = admin.firestore();
const adminAuth = admin.auth();

module.exports = { admin,db ,adminAuth};
