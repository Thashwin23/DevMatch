const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      validate: {
        validator: function (value) {
          return validator.isAlpha(value, "en-US");
        },
        message: "First name can contain only alphabets",
      },
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
      validate: {
        validator: function (value) {
          return validator.isAlpha(value, "en-US");
        },
        message: "Last name can contain only alphabets",
      },
    },

    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [100, "Password cannot exceed 100 characters"],
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      },
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Age must be at least 18"],
      max: [100, "Age cannot be more than 100"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "Age must be a whole number",
      },
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
    },

    photoUrl: {
      type: String,
    trim: true,
      validate: {
        validator: function (value) {
          return validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: "Please enter a valid photo URL",
      },
    },

    about: {
      type: String,
      trim: true,
      maxlength: [500, "About cannot exceed 500 characters"],
      default: "",
    },

    skills: {
      type: [String],
      validate: {
        validator: function (skills) {
          return skills.length <= 20;
        },
        message: "You can add a maximum of 20 skills",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, "DEV@TINDER$77", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordbyUser) {
  const user = this;
  const isMatch = await bcrypt.compare(passwordbyUser, user.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
