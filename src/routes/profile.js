const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const express = require("express");
const ProfileRouter = express.Router();

ProfileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (error) {
    {
      res.status(401).send("Unauthorized: " + error.message);
    }
  }
});

ProfileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error(
        "Invalid updates! Only firstName, lastName, emailId, and password can be updated",
      );
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json({ message: "Profile updated successfully", data: loggedInUser });
  } catch (error) {
    res.status(400).send("Error updating profile: " + error.message);
  }
});

ProfileRouter.patch("/profile/forgotpassword", async (req, res) => {
  try {
    const { emailId, oldPassword, newPassword } = req.body;

    // Check required fields
    if (!emailId || !oldPassword || !newPassword) {
      throw new Error("Email, old password and new password are required");
    }

    // Find user by email
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("User not found");
    }

    // Compare old password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Old password is incorrect");
    }

    // Validate new password
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "New password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(400).send("Error updating password: " + error.message);
  }
});

module.exports = ProfileRouter;
