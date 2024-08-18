const { Profile } = require("../models/index.model");
const { DatabaseError } = require("../utils/errors/index.error");

class ProfileRepository {
  constructor() {
    if (!ProfileRepository.instance) {
      ProfileRepository.instance = this;
    }
    return ProfileRepository.instance;
  }

  static getInstance() {
    if (!ProfileRepository.instance) {
      ProfileRepository.instance = new ProfileRepository();
    }
    return ProfileRepository.instance;
  }

  async findByUserId(data) {
    try {
      const user = await Profile.findOne({ userId: data });
      return {
        userId: user?.userId,
        username: user?.username,
        email: user?.email,
        firstname: user?.firstName,
        lastname: user?.lastName,
        profilePicture: user?.profilePicture,
        bio: user?.bio,
        dateOfBirth: user?.dateOfBirth,
        isActive: user?.isActive,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      };
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async create(profileData) {
    try {
      const profile = new Profile({
        userId: profileData.userId,
        email: profileData.email,
        username: profileData.username,
      });
      return await profile.save();
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async update(userId, updateData) {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        {
          $set: {
            firstName: updateData?.firstname,
            lastName: updateData?.lastname,
            profilePicture: updateData?.profilePicture,
            bio: updateData?.bio,
            dateOfBirth: updateData?.dateOfBirth,
          },
        },
        {
          new: true,
        }
      );
      return {
        userId: profile?.userId,
        username: profile?.username,
        email: profile?.email,
        firstname: profile?.firstName,
        lastname: profile?.lastName,
        profilePicture: profile?.profilePicture,
        bio: profile?.bio,
        dateOfBirth: profile?.dateOfBirth,
        isActive: profile?.isActive,
        createdAt: profile?.createdAt,
        updatedAt: profile?.updatedAt,
      };
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async delete(userId) {
    try {
      return await Profile.updateOne({ userId }, { isActive: false });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

module.exports = ProfileRepository;
