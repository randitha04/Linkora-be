const express = require("express");
const router = express.Router();

router.get("/rooms/:roomId/messages", null);
router.post("/rooms/:roomId/message", null);
router.get("/rooms", null);

module.exports = router;