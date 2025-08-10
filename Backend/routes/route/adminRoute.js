const express = require("express");
const router = express.Router();

const { verifyFirebaseToken } = require('../../middleware/authMiddleware');
const adminMiddleware = require('../../middleware/adminMiddileware');

const {
  dashboard,
  pendinguser,
  reportuser,
  userState,
} = require('../../userController/admin/adminController');


const { adminLogin } = require('../../userController/admin/adminAuth');



// Admin login route
router.post('/admin-login' , adminLogin);

// Dashboard stats route (GET or POST depending on your design)
router.get('/dashboard', verifyFirebaseToken,adminMiddleware , dashboard);

// Get all pending users
router.get('/pending-users', verifyFirebaseToken,adminMiddleware , pendinguser);

// Update userquality for a user (report user)
router.put('/report-user', verifyFirebaseToken,adminMiddleware , reportuser);

// Update register_state for a user
router.put('/user-state', verifyFirebaseToken,adminMiddleware , userState);

module.exports = router;
