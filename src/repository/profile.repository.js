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

  async findByUserId(userId) {
    try {
      return await Profile.findOne({ userId });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async create(profileData) {
    try {
      const profile = new Profile(profileData);
      return await profile.save();
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async update(userId, updateData) {
    try {
      return await Profile.findOneAndUpdate({ userId }, updateData, {
        new: true,
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async delete(userId) {
    try {
      return await Profile.findOneAndDelete({ userId });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

module.exports = ProfileRepository;
