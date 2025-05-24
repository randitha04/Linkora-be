const verifyUserOwnership = (req, res, next) => {
  const { uid } = req.params; 
  const loggedInUserId = req.user?.uid; 

  if (!uid || !loggedInUserId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  if (uid !== loggedInUserId) {
    return res.status(403).json({ message: "You are not authorized to modify this profile." });
  }


  next();
};

module.exports = verifyUserOwnership;
