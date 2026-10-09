import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    nickname: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    accountLast4: { type: String, required: true, match: /^\d{4}$/ },
    bankName: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

beneficiarySchema.index({ owner: 1, email: 1 }, { unique: true });
export default mongoose.model("Beneficiary", beneficiarySchema);
