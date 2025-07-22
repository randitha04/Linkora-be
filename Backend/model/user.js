// models/userModel.js

/**
 * Creates a new user object with the expected fields.
 * You can use this as a template when saving or updating users in Firestore.
 * 
 * @param {Object} data - User data to create a user object
 * @returns {Object} user object
 */
function createUserModel(data) {
  return {
    uid: data.uid,
    fullName: data.fullName,
    nickname: data.nickname || null,
    degreeCard: data.degreeCard || null,
    profilePicture: data.profilePicture || null,
    email: data.email || null,
    profileCompleteness: data.profileCompleteness || 0,

    university: {
      name: data.university?.name || null,
      faculty: data.university?.faculty || null,
      degree: data.university?.degree || null,
      positions: data.university?.positions || null,
    },
    universityName: data.universityName || null,
    facultyName: data.facultyName || null,
    degreeName: data.degreeName || null,
    universityYear: data.universityYear || null,

    whoAmI: data.whoAmI || null,
    relationshipState: data.relationshipState || null,
    location: data.location || null,
    joinDate: data.joinDate || null,

    personality: {
      hobbies: data.personality?.hobbies || [],
      talents: data.personality?.talents || [],
    },

    professional: {
      currentJobs: data.professional?.currentJobs || null,
      societyPositions: data.professional?.societyPositions || null,
      workWithPeople: data.professional?.workWithPeople || null,
      beAroundPeople: data.professional?.beAroundPeople || null,
    },

    activity: {
      posts: data.activity?.posts || 0,
      collaborations: data.activity?.collaborations || 0,
      connections: data.activity?.connections || 0,
    },

    socialLinks: {
      github: data.socialLinks?.github || null,
      linkedin: data.socialLinks?.linkedin || null,
      twitter: data.socialLinks?.twitter || null,
      instagram: data.socialLinks?.instagram || null,
      facebook: data.socialLinks?.facebook || null,
      personalWebsite: data.socialLinks?.personalWebsite || null,
    },

    interests: data.interests || null,
    achievements: data.achievements || null,
    abilities: data.abilities || null,
    skills: data.skills || [],
  }
}

module.exports = { createUserModel }
