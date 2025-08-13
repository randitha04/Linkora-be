const express = require("express");
const router = express.Router();

const profileController = require('../../userController/userController');
const {verifyFirebaseToken} = require('../../middleware/authMiddleware');




// Get user profile
router.get("/get-profile/",verifyFirebaseToken, profileController.getUserProfile);

// Update user profile
router.put("/update-profile/",verifyFirebaseToken, profileController.updateUserProfile);

// Delete user profile
router.delete("/delete-profile/",verifyFirebaseToken, profileController.deleteUserProfile);

// Send friend request
router.post("/friend-request",verifyFirebaseToken, profileController.sendFriendRequest);

// Accept friend request
router.post("/accept-request",verifyFirebaseToken, profileController.acceptFriendRequest);



// Get all friends
router.get("/friends/",verifyFirebaseToken,profileController.getFriends);

// report user
router.put('/report-user',verifyFirebaseToken ,profileController.reportUser);

//Get friends profile
router.get("/friends-profile/:uid", verifyFirebaseToken, profileController.getFriendProfile);

// // Get friend suggestions
// router.get("/friend-suggestions/:uid", profileController.getFriendSuggestions);



module.exports = router;
