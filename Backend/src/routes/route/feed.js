const express = require("express");
const router = express.Router();

router.get("/", null);
router.post("/", null);
router.put("/:postId", null);
router.delete("/:postId", null);
router.post("/:postId/collab-request", null);

module.exports = router;
