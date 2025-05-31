const express = require("express");
const router = express.Router();

router.use("/auth", require("./route/auth"));


router.use("/profile", require("./route/profile"));
// router.use("/feed", require("./route/feed"));
router.use("/collab-board", require("./route/collabBoard"));
// router.use("/search", require("./route/search"));
// router.use("/chat", require("./route/chat"));
// router.use("/notifications", require("./route/notifications"));
// router.use("/profile", require("./route/socials"));

module.exports = router;
