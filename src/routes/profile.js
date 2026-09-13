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

module.exports = ProfileRouter;
