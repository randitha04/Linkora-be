const express = require("express");
const router = express.Router();

router.use("/auth", require("./route/auth"));

router.use("/feed", require("./route/feed"));
router.use("/profile", require("./route/profile"));
router.use("/chat", require("./route/chat"));

//Admin routes
router.use("/admin", require("./route/adminRoute"));




// router.use("/collab-board", require("./route/collabBoard"));




module.exports = router;




