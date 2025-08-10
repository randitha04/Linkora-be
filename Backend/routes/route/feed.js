const express = require("express");
const router = express.Router();

const { verifyFirebaseToken } = require('../../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  friendsPosts
} = require('../../userController/feedController');

// Get all posts
router.get("/posts", verifyFirebaseToken, getAllPosts);

// Get a single post by ID
router.get("/posts/:postId", verifyFirebaseToken, getPostById);

// Create a new post
router.post("/posts-create", verifyFirebaseToken, createPost);

// Update a post by ID
router.put("/posts-update/:postId", verifyFirebaseToken, updatePost);

// Delete a post by ID
router.delete("/posts-delete/:postId", verifyFirebaseToken, deletePost);

// Get friends' posts
router.get("/friends-posts/:userId", verifyFirebaseToken, friendsPosts);


module.exports = router;
