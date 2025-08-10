const { db } = require('../config/firebaseConfig');
const { StreamChat } = require('stream-chat')

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET
const chatClient = StreamChat.getInstance(apiKey, apiSecret)

const createChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join("_");
};



// Express or Next.js API handler
const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.fullName || '',
        image: data.profilePicture|| '',
        streamUserId: data.streamUserId || doc.id,
      };
    });
    console.log('Fetched users:', users);
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};


const getStreamChatToken = async (req, res) => {
  try {
    const userId = req.body?.userId || req.query?.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const token = chatClient.createToken(userId);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('[Token Error]', error);
    return res.status(500).json({ error: 'Could not generate token' });
  }
};


// POST /api/start-channel
const startChannel = async (req, res) => {
  const { userA, userB } = JSON.parse(req.body);

  if (!userA || !userB) return res.status(400).json({ error: 'Missing user' });

  const channelId = [userA, userB].sort().join('-');
  const channel = chatClient.channel('messaging', channelId, {
    members: [userA, userB],
  });

  await channel.create();
  res.json({ channelId });
};









module.exports = {

  getStreamChatToken,
  getAllUsers,
  startChannel
  
};
