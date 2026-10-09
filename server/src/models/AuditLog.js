import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, required: true, index: true },
    entityType: String,
    entityId: String,
    ip: String,
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

auditLogSchema.index({ createdAt: -1 });
export default mongoose.model("AuditLog", auditLogSchema);
