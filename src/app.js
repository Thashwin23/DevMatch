const express = require("express");
const app = express(); // Create an instance of the Express application

app.use("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.use("/test", (req, res) => {
  res.send("Hello, from the server!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
