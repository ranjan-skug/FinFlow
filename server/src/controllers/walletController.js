import crypto from "crypto";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import { audit } from "../utils/audit.js";

const ref = () =>
  `FF-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

export async function addMoney(req, res) {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount < 100 || amount > 100000)
    return res
      .status(400)
      .json({ message: "Demo top-up must be between ₹100 and ₹100,000" });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { walletBalance: amount } },
    { new: true },
  );
  const transaction = await Transaction.create({
    reference: ref(),
    type: "credit",
    category: "add_money",
    amount,
    description: "Demo wallet top-up",
    user: user._id,
  });
  await Notification.create({
    user: user._id,
    title: "Wallet credited",
    message: `₹${amount.toFixed(2)} added to your demo wallet.`,
    type: "success",
  });
  await audit(req, "WALLET_TOPUP", "Transaction", transaction._id, { amount });
  res.json({ balance: user.walletBalance, transaction });
}

export async function transfer(req, res) {
  const { email, amount, note } = req.body;
  const value = Number(amount);
  if (!email || !Number.isFinite(value) || value <= 0)
    return res
      .status(400)
      .json({ message: "Valid recipient and amount are required" });
  if (value > 100000)
    return res.status(400).json({ message: "Demo transfer limit is ₹100,000" });
  if (email.toLowerCase() === req.user.email)
    return res.status(400).json({ message: "You cannot transfer to yourself" });

  const recipient = await User.findOne({
    email: email.toLowerCase(),
    status: "active",
  });
  if (!recipient)
    return res.status(404).json({ message: "Recipient not found" });

  const sender = await User.findOneAndUpdate(
    { _id: req.user._id, walletBalance: { $gte: value } },
    { $inc: { walletBalance: -value } },
    { new: true },
  );
  if (!sender)
    return res.status(400).json({ message: "Insufficient wallet balance" });
  await User.findByIdAndUpdate(recipient._id, {
    $inc: { walletBalance: value },
  });

  const transactionRef = ref();
  const senderTx = await Transaction.create({
    reference: transactionRef,
    type: "debit",
    category: "transfer",
    amount: value,
    description: note || `Transfer to ${recipient.name}`,
    user: sender._id,
    counterparty: recipient._id,
  });
  await Transaction.create({
    reference: `${transactionRef}-CR`,
    type: "credit",
    category: "transfer",
    amount: value,
    description: `Received from ${sender.name}`,
    user: recipient._id,
    counterparty: sender._id,
  });
  await Notification.create({
    user: recipient._id,
    title: "Money received",
    message: `₹${value.toFixed(2)} received from ${sender.name}.`,
    type: "success",
  });
  await Notification.create({
    user: sender._id,
    title: "Transfer completed",
    message: `₹${value.toFixed(2)} sent to ${recipient.name}.`,
    type: "success",
  });
  await audit(req, "MONEY_TRANSFER", "Transaction", senderTx._id, {
    amount: value,
    recipient: recipient.email,
  });
  res.json({ balance: sender.walletBalance, transaction: senderTx });
}

export async function transactions(req, res) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const query = { user: req.user._id };
  if (req.query.type) query.type = req.query.type;
  const items = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("counterparty", "name email");
  res.json({ transactions: items });
}
