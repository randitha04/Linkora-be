const user = {
  uid: "", // Firebase Auth UID
  email: "",
  name: "",
  universityName: "",
  facultyName: "",
  degreeName: "",
  universityYear: "", // e.g., "1st Year", "2nd Year"
  relationshipState: "", // e.g., "Looking for a relationship", "Not interested", "In a relationship"
  whoAmI: "", // Self-description
  interests: "", // Things you like to do
  achievements: "", // Achievements received
  abilities: "", // Skills or abilities
  role: "user",
  register_state: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
};
