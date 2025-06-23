// routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages
} = require("../../userController/chatController");



//  Send message
router.post("/rooms/message", sendMessage);

//  Get messages between two users
router.get("/rooms/:uid1/:uid2/messages", getMessages);

module.exports = router;
