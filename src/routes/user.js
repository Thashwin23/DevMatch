const express = require("express");
const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_FIELDS = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const receivedRequests = await ConnectionRequest.find({
      touserId: loggedUser._id,
      status: "interested",
    }).populate("fromuserId", USER_SAFE_FIELDS);
    // .populate("touserId", "firstName lastName");
    res.json({
      message: "Received requests fetched successfully",
      data: receivedRequests,
    });
  } catch (error) {
    res.status(400).send("Error fetching received requests: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromuserId: loggedUser._id, status: "accepted" },
        { touserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromuserId", USER_SAFE_FIELDS)
      .populate("touserId", USER_SAFE_FIELDS);

    const data = connections.map((connection) => {
      if (connection.fromuserId.toString() === loggedUser._id.toString()) {
        return connection.touserId;
      }

      return connection.fromuserId;
    });

    res.json({
      data,
    });
  } catch (error) {
    res.status(400).send("Error fetching connections: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromuserId: loggedInUser._id }, { touserId: loggedInUser._id }],
    }).select("fromuserId  touserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromuserId.toString());
      hideUsersFromFeed.add(req.touserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
