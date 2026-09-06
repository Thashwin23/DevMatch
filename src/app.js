const express = require("express");
const app = express(); // Create an instance of the Express application

app.use("/admin", (req, res, next) => {
  console.log("Admin route accessed");
  const token = "xyz444";
  const isAuthenticated = token === "xyz"; // Simulated authentication check
  if (!isAuthenticated) {
    return res.status(401).send("Unauthorized");
  }
  next();
});

app.get("/admin/getAllUsers", (req, res) => {
  console.log("Received request to get all users");
  res.send("This is the response for getAllUsers");
});

app.delete("/admin/deleteUser", (req, res) => {
  console.log("Received request to delete a user");
  res.send("This is the response for deleteUser");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
