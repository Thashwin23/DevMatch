const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database"); // Import the database connection configuration
const app = express(); // Create an instance of the Express application
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");

app.use(express.json()); // Middleware to parse JSON

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      res.send("Login successful");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});

app.delete("/delete", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const result = await User.findByIdAndDelete({ userEmailId });
    if (!result) {
      res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting user: " + error.message);
  }
});

app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const updateData = req.body;
  try {
    const ALLOWED_UPDATES = ["age", "gender"];
    const updates = Object.keys(updateData).every((update) =>
      ALLOWED_UPDATES.includes(update),
    );

    if (!updates) {
      throw new Error("Invalid updates! Only age and gender can be updated");
    }

    const result = await User.findByIdAndUpdate(userId, updateData);
    if (!result) {
      res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error updating user: " + error.message);
  }
});

app.get("/users", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmailId });
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching users: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmailId });
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching users: " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching users: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
