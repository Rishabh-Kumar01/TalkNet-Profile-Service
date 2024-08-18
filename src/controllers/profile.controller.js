const { ProfileService } = require("../services/index.service");
const { StatusCodes } = require("../utils/imports.util").responseCodes;

class ProfileController {
  constructor() {
    this.profileService = ProfileService.getInstance();
  }

  static getInstance() {
    if (!ProfileController.instance) {
      ProfileController.instance = new ProfileController();
    }
    return ProfileController.instance;
  }

  async getProfile(req, res, next) {
    try {
      const profile = await this.profileService.getProfile(req.params.userId);
      res.status(StatusCodes.OK).json({
        message: "Fetch profile successfully",
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updatedProfile = await this.profileService.updateProfile(
        req.params.userId,
        req.body
      );
      res.status(StatusCodes.OK).json({
        message: "Profile updated successfully",
        success: true,
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req, res, next) {
    try {
      const result = await this.profileService.deleteProfile(req.params.userId);
      res.status(StatusCodes.OK).json({
        message: "Profile deleted successfully",
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileController;
