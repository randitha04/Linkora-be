
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const approveUserController = async (req, res, next) => {
  try {
    const userId = req.user?.uid; 
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userData = userDoc.data();
    if (userData.profileState !=='pending') {
      return next(); 
    }
    const newState = userData.isAdmin ? 'approved' : 'rejected';

    await userRef.update({
      profileState: newState,
    });

    console.log(`User ${userId} state updated to ${newState}`);
    next();
  } catch (error) {
    console.error('Error in approval middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = approveUserController;
