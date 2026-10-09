import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import AuditLog from "../models/AuditLog.js";

export async function dashboard(req, res) {
  const [users, verified, txCount, credits, debits] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ kycStatus: "verified" }),
    Transaction.countDocuments(),
    Transaction.aggregate([
      { $match: { type: "credit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { type: "debit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);
  res.json({
    metrics: {
      users,
      verifiedKyc: verified,
      transactions: txCount,
      totalCredits: credits[0]?.total || 0,
      totalDebits: debits[0]?.total || 0,
    },
  });
}

export async function audits(req, res) {
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("actor", "name email");
  res.json({ logs });
}
