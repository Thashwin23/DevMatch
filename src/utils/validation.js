const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("A valid email address is required");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    );
  }
};

module.exports = {
  validateSignupData,
};
