import AuditLog from "../models/AuditLog.js";

export async function audit(
  req,
  action,
  entityType = "",
  entityId = "",
  details = {},
) {
  try {
    await AuditLog.create({
      actor: req.user?._id || null,
      action,
      entityType,
      entityId: entityId?.toString(),
      ip: req.ip,
      details,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
}
