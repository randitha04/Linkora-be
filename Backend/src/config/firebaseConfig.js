
var admin = require("firebase-admin");

var serviceAccount = require("../../../../Service account/Service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});

const db = admin.firestore();

module.exports = { admin,db };
