const express = require("express");
const router = express.Router();

router.use("/auth", require("./route/auth"));


router.use("/profile", require("./route/profile"));
router.use("/collab-board", require("./route/collabBoard"));
router.use("/chat", require("./route/chat"));


//Admin routes
// router.use("/admin", require("./route/adminRoute"));

module.exports = router;
