const express = require("express");
const app = express(); // Create an instance of the Express application

app.get(
  "/example",
  (req, res, next) => {
    console.log("First handler");
    // Passes control to the next middleware function or route handler
    res.send("First handler");
    next();
  },
  (req, res) => {
    res.send("Second handler");
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
