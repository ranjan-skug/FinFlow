import Beneficiary from "../models/Beneficiary.js";

export async function list(req, res) {
  res.json({
    beneficiaries: await Beneficiary.find({ owner: req.user._id }).sort({
      createdAt: -1,
    }),
  });
}
export async function create(req, res) {
  const { nickname, email, accountLast4, bankName } = req.body;
  if (!nickname || !email || !accountLast4 || !bankName)
    return res
      .status(400)
      .json({ message: "All beneficiary fields are required" });
  const item = await Beneficiary.create({
    owner: req.user._id,
    nickname,
    email,
    accountLast4,
    bankName,
  });
  res.status(201).json({ beneficiary: item });
}
export async function remove(req, res) {
  await Beneficiary.deleteOne({ _id: req.params.id, owner: req.user._id });
  res.json({ message: "Beneficiary removed" });
}
