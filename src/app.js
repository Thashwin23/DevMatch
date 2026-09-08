const express = require("express");
const connectDB = require("./config/database"); // Import the database connection configuration
const app = express(); // Create an instance of the Express application
const User = require("./models/user");

app.use(express.json()); // Middleware to parse JSON

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }

  // user.save();
  // res.send("User created successfully");
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
