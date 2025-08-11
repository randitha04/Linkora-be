const { adminAuth } = require("./../../config/firebaseConfig");

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  try {
    let user;
    try {
      user = await adminAuth.getUserByEmail(email);
      console.log("✅ Admin user already exists:", email);
    } catch (err) {
      console.log("⚠ Admin user not found — creating...");
      user = await adminAuth.createUser({ email, password });
      console.log("✅ Admin user created:", email);
    }

    // Set admin role claim (safe to call every time)
    await adminAuth.setCustomUserClaims(user.uid, { role: "admin" });
    console.log("✅ Admin role set for:", email);
  } catch (error) {
    console.error("❌ Error ensuring admin user:", error);
  }
}




module.exports = ensureAdminUser;