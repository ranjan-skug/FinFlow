import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      index: true,
    },
    kycStatus: {
      type: String,
      enum: ["not_submitted", "pending", "verified", "rejected"],
      default: "not_submitted",
      index: true,
    },
    walletBalance: { type: Number, default: 0, min: 0 },
    avatarUrl: String,
    address: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "India" },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
