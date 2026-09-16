const express = require("express");
const connectDB = require("./config/database"); // Import the database connection configuration
const app = express(); // Create an instance of the Express application

const cookieParser = require("cookie-parser");

app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser()); // Middleware to parse cookies

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

// app.delete("/delete", async (req, res) => {
//   const userEmailId = req.body.emailId;
//   try {
//     const result = await User.findByIdAndDelete({ userEmailId });
//     if (!result) {
//       res.status(404).send("User not found");
//     }
//     res.send("User deleted successfully");
//   } catch (error) {
//     res.status(400).send("Error deleting user: " + error.message);
//   }
// });

// app.patch("/update", async (req, res) => {
//   const userId = req.body.userId;
//   const updateData = req.body;
//   try {
//     const ALLOWED_UPDATES = ["age", "gender"];
//     const updates = Object.keys(updateData).every((update) =>
//       ALLOWED_UPDATES.includes(update),
//     );

//     if (!updates) {
//       throw new Error("Invalid updates! Only age and gender can be updated");
//     }

//     const result = await User.findByIdAndUpdate(userId, updateData);
//     if (!result) {
//       res.status(404).send("User not found");
//     }
//     res.send("User updated successfully");
//   } catch (error) {
//     res.status(400).send("Error updating user: " + error.message);
//   }
// });

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
