




// routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getStreamChatToken,
  startChannel,
} = require("../../userController/chatController");
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');



// Get Stream chat token

router.post('/token',verifyFirebaseToken, getStreamChatToken)

// Get all users for chat
router.get('/all-users', verifyFirebaseToken, getAllUsers)

// Start a new chat channel
router.post('/start-channel', verifyFirebaseToken, startChannel);






module.exports = router;
