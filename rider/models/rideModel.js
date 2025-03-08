import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    captain: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "started", "completed"],
      default: "requested",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ride", userSchema);
