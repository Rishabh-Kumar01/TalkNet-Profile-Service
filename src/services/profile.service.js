const { ProfileRepository } = require("../repository/index.repository");
const { ServiceError, DatabaseError } = require("../utils/errors/index.error");
const { StatusCodes } = require("../utils/imports.util").responseCodes;

class ProfileService {
  constructor() {
    this.profileRepository = ProfileRepository.getInstance();
  }

  static getInstance() {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(userId) {
    try {
      const profile = await this.profileRepository.findByUserId(userId);
      if (!profile) {
        throw new ServiceError(
          "Profile not found",
          "The requested profile does not exist",
          StatusCodes.NOT_FOUND
        );
      }

      if (profile.isActive === false) {
        throw new ServiceError(
          "Profile not found",
          "The requested profile has been deactivated",
          StatusCodes.NOT_FOUND
        );
      }

      return profile;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Database operation failed",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Get profile failed",
        "An error occurred while fetching the profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createProfile(profileData) {
    try {
      return await this.profileRepository.create(profileData);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Database operation failed",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      throw new ServiceError(
        "Create profile failed",
        "An error occurred while creating the profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateProfile(userId, updateData) {
    try {
      await this.getProfile(userId);
      const updatedProfile = await this.profileRepository.update(
        userId,
        updateData
      );
      if (!updatedProfile) {
        throw new ServiceError(
          "Update failed",
          "Unable to update profile",
          StatusCodes.NOT_FOUND
        );
      }
      return updatedProfile;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Database operation failed",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Update profile failed",
        "An error occurred while updating the profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteProfile(userId) {
    try {
      const deletedProfile = await this.profileRepository.delete(userId);
      if (!deletedProfile) {
        throw new ServiceError(
          "Delete failed",
          "Unable to delete profile",
          StatusCodes.NOT_FOUND
        );
      }
      return { message: "Profile deleted successfully" };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Database operation failed",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Delete profile failed",
        "An error occurred while deleting the profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = ProfileService;
