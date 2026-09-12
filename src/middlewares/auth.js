const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found");
    }
    const decoded = jwt.verify(token, "DEV@TINDER$77");

    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized: " + error.message);
  }
};

module.exports = { userAuth };
