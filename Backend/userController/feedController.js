const { db, admin } = require('../config/firebaseConfig');






const createPost = async (req, res) => {
  try {
    console.log('Creating post with data:', req.body);
    // Use uid from verified token instead of req.body.userId
    const userId = req.user?.uid; 
    if (!userId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Missing title or content" });
    }

    try {
        const docRef = await db
          .collection("users")
          .doc(userId)
          .collection("posts")
          .add({
            title,
            content,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log("Post created with ID:", docRef.id);
  res.status(201).json({ id: docRef.id, userId, title, content });
    } catch (error) {
         console.error("Error creating post in Firestore:", error);
  res.status(500).json({ error: error.message });
    }

   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    const postsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all posts for a specific user by userId (sent from frontend)
const friendsPosts = async (req, res) => {
  try {
    const targetUserId = req.params.userId; 

    if (!targetUserId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const postsSnapshot = await db
      .collection("users")
      .doc(targetUserId)
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    if (postsSnapshot.empty) {
      return res.status(200).json([]); 
    }

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      authorId: targetUserId,
      ...doc.data(),
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Friends posts error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Get a single post by id
const getPostById = async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    const { postId } = req.params;
    if (!postId) return res.status(400).json({ error: "Missing postId parameter" });

    const postDoc = await db
      .collection("users")
      .doc(userId)
      .collection("posts")
      .doc(postId)
      .get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ id: postDoc.id, ...postDoc.data() });
  } catch (error) {
    console.error("Get post by ID error:", error);
    res.status(500).json({ error: error.message });
  }
};



const updatePost = async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    const { postId } = req.params;
    if (!postId) return res.status(400).json({ error: "Missing postId parameter" });

    const { title, content } = req.body;
    if (!title && !content) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const postRef = db
      .collection("users")
      .doc(userId)
      .collection("posts")
      .doc(postId);

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (title) updates.title = title;
    if (content) updates.content = content;

    await postRef.update(updates);

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ error: "User not authenticated" });

    const { postId } = req.params;
    if (!postId) return res.status(400).json({ error: "Missing postId parameter" });

    await db
      .collection("users")
      .doc(userId)
      .collection("posts")
      .doc(postId)
      .delete();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  friendsPosts
};
