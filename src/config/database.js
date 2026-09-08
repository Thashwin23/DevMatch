const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://thashwin1234_db_user:uaX4LNxIoFQ3jNgb@nodeproject.bcyxkn8.mongodb.net/devMatch",
  );
};

module.exports = connectDB;
