import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["info", "success", "warning", "security"],
      default: "info",
    },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
