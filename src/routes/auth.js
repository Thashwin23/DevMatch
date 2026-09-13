const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of. data
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (isPasswordMatch) {
      //create jwt token
      const token = await user.getJWT();

      //add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout successful");
  } catch (error) {
    res.status(400).send("Error logging out: " + error.message);
  }
});

module.exports = authRouter;
