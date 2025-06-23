const express = require("express");
const router = express.Router();

const approveUserController = require('../../userController/admin/adminController');

router.put('/userProfileState', approveUserController);

