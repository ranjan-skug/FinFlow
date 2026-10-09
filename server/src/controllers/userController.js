import User from "../models/User.js";
import { audit } from "../utils/audit.js";

export async function profile(req, res) {
  res.json({ user: req.user });
}

export async function submitKyc(req, res) {
  const { address, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { address, phone, kycStatus: "pending" },
    { new: true },
  );
  await audit(req, "KYC_SUBMITTED", "User", user._id);
  res.json({ user, message: "KYC submitted for review" });
}

export async function listUsers(req, res) {
  const q = req.query.q
    ? {
        $or: [
          { name: new RegExp(req.query.q, "i") },
          { email: new RegExp(req.query.q, "i") },
        ],
      }
    : {};
  const users = await User.find(q)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ users });
}

export async function setUserStatus(req, res) {
  const status = req.body.status;
  if (!["active", "blocked"].includes(status))
    return res.status(400).json({ message: "Invalid status" });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  ).select("-password");
  await audit(req, `USER_${status.toUpperCase()}`, "User", user._id);
  res.json({ user });
}

export async function reviewKyc(req, res) {
  const status = req.body.status;
  if (!["verified", "rejected", "pending"].includes(status))
    return res.status(400).json({ message: "Invalid KYC status" });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { kycStatus: status },
    { new: true },
  ).select("-password");
  await audit(req, "KYC_REVIEWED", "User", user._id, { status });
  res.json({ user });
}
