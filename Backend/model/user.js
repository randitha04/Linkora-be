// models/userModel.js

/**
 * Creates a new user object with the expected fields.
 * You can use this as a template when saving or updating users in Firestore.
 * 
 * @param {Object} data - User data to create a user object
 * @returns {Object} user object
 */
// models/userModel.js

function createUserModel(data) {
  return {
    uid: data.uid,
    fullName: data.fullName,
    degreeCard: data.degreeCard || null,
    Gender: data.Gender || null,
    profilePicture: data.profilePicture || null,
    bannerImage: data.bannerImage || null,
    email: data.email || null,
    profileCompleteness: data.profileCompleteness || 0,

    university: {
      name: data.university?.name || null,
      faculty: data.university?.faculty || null,
      degree: data.university?.degree || null,
      positions: data.university?.positions || null,
      universityYear: data.university?.universityYear || null,
    },
    relationshipState: data.relationshipState || null,
      
     socialPreferences: {
  workWithPeople: data.socialPreferences?.workWithPeople || "",
  beAroundPeople: data.socialPreferences?.beAroundPeople || "",
},
    personality: {
      hobbies: data.personality?.hobbies || [],
      interests: data.personality?.interests || null,
      achievements: data.personality?.achievements || null,
      abilities: data.personality?.abilities || null,
      skills: data.personality?.skills || [],
      type: data.personality?.type || "",
      whoAmI: data.personality?.whoAmI || null,
    },

    activity: {
      posts: data.activity?.posts || 0,
      collaborations: data.activity?.collaborations || 0,
      connections: data.activity?.connections || 0,
    },

    role: data.role || "user",
    register_state: data.register_state || false,
    userquality: data.userquality || "good",
    profile_state: data.profile_state || "pending",
  
  };
}



module.exports = { createUserModel }
