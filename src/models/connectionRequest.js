const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromuserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    touserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status`,
      },
    },
  },
  {
    timestamps: true,
  },
);
connectionRequestSchema.index({ fromuserId: 1, touserId: 1 });
connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  // Check if a connection request already exists between the two users
  if (connectionRequest.fromuserId.equals(connectionRequest.touserId)) {
    throw new Error("Cannot send a connection request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
