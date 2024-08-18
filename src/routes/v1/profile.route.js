const express = require("express");
const { ProfileController } = require("../../controllers/index.controller");
const { AuthMiddleware } = require("../../middlewares/index.middleware");

const router = express.Router();
const profileController = ProfileController.getInstance();

router.get(
  "/:userId",
  AuthMiddleware.authenticate,
  profileController.getProfile
);
router.put(
  "/:userId",
  AuthMiddleware.authenticate,
  profileController.updateProfile
);
router.delete(
  "/:userId",
  AuthMiddleware.authenticate,
  profileController.deleteProfile
);

module.exports = router;
