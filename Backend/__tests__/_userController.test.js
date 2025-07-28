const { getUserProfile,updateUserProfile } = require("../userController/userController");
const { db,admin } = require("../config/firebaseConfig");
const cloudinary = require('cloudinary').v2;

jest.mock("../config/firebaseConfig", () => ({
  db: {
    collection: jest.fn(),
  },
}));

const mockReq = {
  user: { uid: "test-user-id" },
};

const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
};

describe("getUserProfile", () => {
  it("should return 401 if user is not authenticated", async () => {
    const req = { user: null };
    await getUserProfile(req, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Unauthorized: User ID not found in token",
    });
  });

  it("should return 404 if user not found in Firestore", async () => {
    const mockDoc = { exists: false };
    const mockDocRef = { get: jest.fn().mockResolvedValue(mockDoc) };
    db.collection.mockReturnValue({ doc: () => mockDocRef });

    await getUserProfile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return user profile when user is found", async () => {
    const mockUserData = {
      email: "thusi@example.com",
      profilePicture: "http://image.url",
    };
    const mockDoc = {
      exists: true,
      data: () => mockUserData,
    };
    const mockDocRef = { get: jest.fn().mockResolvedValue(mockDoc) };
    db.collection.mockReturnValue({ doc: () => mockDocRef });

    const mockModel = jest.fn().mockReturnValue({ name: "Mocked User" });
    jest.mock("../model/user.js", () => ({
      createUserModel: mockModel,
    }));

    await getUserProfile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User profile fetched successfully",
      })
    );
  });
});


jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(),
    update: jest.fn(),
  }),
}));

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
    },
  },
}));

describe('updateUserProfile', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { uid: '123' },
      body: {
        fullName: 'Test User',
        nickname: 'Tester',
        profilePicture: 'data:image/png;base64,testdata',
        university: {},
        professional: {},
        personality: {},
        socialLinks: {},
        activity: {},
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should return 401 if user not authenticated', async () => {
    req.user = null;
    await updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized: User ID not found in token',
    });
  });

  it('should return 404 if user doc does not exist', async () => {
    admin.firestore().doc().get.mockResolvedValue({ exists: false });
    await updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should upload image and update profile successfully', async () => {
    admin.firestore().doc().get.mockResolvedValue({ exists: true });
    admin.firestore().doc().update.mockResolvedValue();
    cloudinary.uploader.upload.mockResolvedValue({
      secure_url: 'http://cloudinary.com/testimage.jpg',
    });

    await updateUserProfile(req, res);

    expect(cloudinary.uploader.upload).toHaveBeenCalled();
    expect(admin.firestore().doc().update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Profile updated successfully',
    });
  });

  it('should handle unexpected error', async () => {
    admin.firestore().doc().get.mockRejectedValue(new Error('Firestore error'));
    await updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to update profile',
      error: 'Firestore error',
    });
  });
});
