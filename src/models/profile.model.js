const { mongoose } = require("../utils/imports.util");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    dateOfBirth: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
