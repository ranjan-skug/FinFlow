import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { signToken, setAuthCookie } from "../utils/token.js";
import { audit } from "../utils/audit.js";

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  if (await User.exists({ email: email.toLowerCase() }))
    return res.status(409).json({ message: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: passwordHash,
    phone,
  });
  await Notification.create({
    user: user._id,
    title: "Welcome to FinFlow",
    message: "Your account was created successfully.",
    type: "success",
  });
  const token = signToken(user);
  setAuthCookie(res, token);
  await audit(req, "USER_REGISTERED", "User", user._id, { email: user.email });
  res.status(201).json({ user: serializeUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select(
    "+password",
  );
  if (!user || !(await bcrypt.compare(password || "", user.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  if (user.status !== "active")
    return res.status(403).json({ message: "Account is blocked" });
  setAuthCookie(res, signToken(user));
  await audit(req, "USER_LOGIN", "User", user._id);
  res.json({ user: serializeUser(user) });
}

export async function logout(req, res) {
  res.clearCookie("finflow_token");
  if (req.user) await audit(req, "USER_LOGOUT", "User", req.user._id);
  res.json({ message: "Logged out successfully" });
}

export async function me(req, res) {
  res.json({ user: serializeUser(req.user) });
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    kycStatus: user.kycStatus,
    walletBalance: user.walletBalance,
    avatarUrl: user.avatarUrl,
  };
}
