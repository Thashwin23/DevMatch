const validator = require("validator");

const validateSignupData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoUrl,
    skills,
  } = req.body;

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

  if (age === undefined || age === null) {
    throw new Error("Age is required");
  }

  if (!Number.isInteger(age) || age < 18 || age > 100) {
    throw new Error("Age must be a whole number between 18 and 100");
  }

  if (!gender) {
    throw new Error("Gender is required");
  }

  if (!["male", "female", "other"].includes(gender.toLowerCase())) {
    throw new Error("Gender must be male, female, or other");
  }

  // photoUrl is optional, but if provided, validate it
  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Please provide a valid photo URL");
  }

  // skills is optional, but if provided, it should be an array
  if (skills && !Array.isArray(skills)) {
    throw new Error("Skills must be an array");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditsFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((update) =>
    allowedEditsFields.includes(update),
  );
  return isEditAllowed;
};
module.exports = {
  validateSignupData,
  validateEditProfileData,
};
