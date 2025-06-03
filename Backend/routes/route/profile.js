const express = require("express");
const router = express.Router();

const profileController = require('../../controllers/userController');
const {verifyFirebaseToken} = require('../../middleware/authMiddleware');



// Get user profile
router.get("/get-profile/",verifyFirebaseToken, profileController.getUserProfile);

// Update user profile
router.put("/update-profile/", profileController.updateUserProfile);

// Delete user profile
router.delete("/delete-profile/", profileController.deleteUserProfile);

// Send friend request
router.post("/friend-request", profileController.sendFriendRequest);

// Accept friend request
router.post("/accept-request", profileController.acceptFriendRequest);



// Get all friends
router.get("/friends/",profileController.getFriends);

//Get friends profile
router.get("/friends-profile/" , profileController.getFriendProfile);

// // Get friend suggestions
// router.get("/friend-suggestions/:uid", profileController.getFriendSuggestions);



module.exports = router;
