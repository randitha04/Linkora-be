const { db } = require('../config/firebaseConfig');

const createChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join("_");
};


const sendMessage = async (req, res) => {
  const { senderUid, receiverUid, text } = req.body;
  if (!senderUid || !receiverUid || !text) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const chatId = createChatId(senderUid, receiverUid);
  const chatRef = db.collection("Chats").doc(chatId);

  try {
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
      await chatRef.set({ users: [senderUid, receiverUid] });
    }

    const message = {
      senderUid,
      text,
      timestamp: new Date()
    };

    await chatRef.collection("messages").add(message);
    res.status(200).json({ message: "Message sent", chatId });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};
const getMessages = async (req, res) => {
  const { uid1, uid2 } = req.params;
  const chatId = createChatId(uid1, uid2);

  try {
    const messagesSnapshot = await db
      .collection("Chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp")
      .get();

    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ chatId, messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages
};
