import Notification from "../models/Notification.js";

export async function list(req, res) {
  res.json({
    notifications: await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50),
  });
}
export async function markRead(req, res) {
  await Notification.updateOne(
    { _id: req.params.id, user: req.user._id },
    { read: true },
  );
  res.json({ message: "Notification marked as read" });
}
