import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    category: {
      type: String,
      enum: ["add_money", "transfer", "cash_out", "refund", "fee"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
      index: true,
    },
    description: { type: String, trim: true, maxlength: 200 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    counterparty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

transactionSchema.index({ user: 1, createdAt: -1 });
export default mongoose.model("Transaction", transactionSchema);
