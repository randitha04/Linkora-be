const express = require("express");
const router = express.Router();

const { verifyFirebaseToken } = require('../../middleware/authMiddleware');
const adminMiddleware = require('../../middleware/adminMiddileware');

const {
  dashboard,
  pendinguser,
  reportUser,
  userState,
  resolveReport,
  getReportedUsers,
  approveReportAndDeleteUser
} = require('../../userController/admin/adminController');


const { adminLogin,adminRefreshToken } = require('../../userController/admin/adminAuth');



// Admin login route
router.post('/admin-login' , adminLogin);

//refresh_admin_token
router.post('/refresh-admin-token',adminRefreshToken )

// Dashboard stats route (GET or POST depending on your design)
router.get('/dashboard',adminMiddleware , dashboard);

// Get all pending users
router.get('/pending-users',adminMiddleware , pendinguser);


// Update register_state for a user
router.put('/user-state',adminMiddleware , userState);



//report hadler

// Update userquality for a user (report user)
router.put('/report-user',adminMiddleware , reportUser);

router.get('/get-reported-users',adminMiddleware , getReportedUsers);


router.put('/resolve-report',adminMiddleware , resolveReport);

router.delete('/approve-report',adminMiddleware , approveReportAndDeleteUser)


module.exports = router;
