import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import Beneficiary from "../models/Beneficiary.js";
import AuditLog from "../models/AuditLog.js";

// Demo-only credentials
const CUSTOMER_PASSWORD = "Demo@12345";
const ADMIN_PASSWORD = "Admin@12345";

const demoEmails = [
  "admin@finflow.demo",
  "demo@finflow.demo",
  "priya@finflow.demo",
  "rohit@finflow.demo",
  "sneha@finflow.demo",
  "blocked@finflow.demo",
];

const ago = (days = 0, hours = 0) =>
  new Date(Date.now() - days * 86400000 - hours * 3600000);

function makeTransaction({
  reference,
  type,
  category,
  amount,
  description,
  user,
  counterparty = null,
  status = "completed",
  daysAgo = 0,
  metadata = {},
}) {
  const createdAt = ago(daysAgo);

  return {
    reference,
    type,
    category,
    amount,
    currency: "INR",
    status,
    description,
    user: user._id,
    counterparty: counterparty?._id ?? null,
    metadata,
    createdAt,
    updatedAt: createdAt,
  };
}

function makeNotification(
  user,
  title,
  message,
  type = "info",
  read = false,
  daysAgo = 0,
) {
  const createdAt = ago(daysAgo);

  return {
    user: user._id,
    title,
    message,
    type,
    read,
    createdAt,
    updatedAt: createdAt,
  };
}

function makeAuditLog(
  actor,
  action,
  entityType,
  entityId,
  details = {},
  daysAgo = 0,
) {
  const createdAt = ago(daysAgo);

  return {
    actor: actor?._id ?? null,
    action,
    entityType,
    entityId: String(entityId ?? ""),
    ip: "127.0.0.1",
    details,
    createdAt,
    updatedAt: createdAt,
  };
}

async function seedDatabase() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_DEMO_SEED !== "true"
  ) {
    throw new Error(
      "Seeding is disabled in production. Use an isolated demo database.",
    );
  }

  await connectDB();

  try {
    console.log("Removing previous FinFlow demo data...");

    // Find only the reserved demo accounts.
    const oldUsers = await User.find({
      email: { $in: demoEmails },
    }).select("_id");

    const oldIds = oldUsers.map((user) => user._id);
    const oldIdStrings = oldIds.map((id) => id.toString());

    // Delete related records before deleting demo users.
    await Promise.all([
      Transaction.deleteMany({
        $or: [{ user: { $in: oldIds } }, { counterparty: { $in: oldIds } }],
      }),

      Beneficiary.deleteMany({
        owner: { $in: oldIds },
      }),

      Notification.deleteMany({
        user: { $in: oldIds },
      }),

      AuditLog.deleteMany({
        $or: [{ actor: { $in: oldIds } }, { entityId: { $in: oldIdStrings } }],
      }),
    ]);

    await User.deleteMany({
      email: { $in: demoEmails },
    });

    console.log("Creating demo users...");

    const [adminHash, customerHash] = await Promise.all([
      bcrypt.hash(ADMIN_PASSWORD, 12),
      bcrypt.hash(CUSTOMER_PASSWORD, 12),
    ]);

    const [admin, aarav, priya, rohit, sneha, blocked] = await User.create([
      {
        name: "FinFlow Demo Admin",
        email: "admin@finflow.demo",
        password: adminHash,
        role: "admin",
        status: "active",
        kycStatus: "verified",
        walletBalance: 0,
        phone: "9999990000",
        address: {
          line1: "FinFlow Demo Office",
          city: "Noida",
          state: "Uttar Pradesh",
          postalCode: "201301",
          country: "India",
        },
      },
      {
        name: "Aarav Sharma",
        email: "demo@finflow.demo",
        password: customerHash,
        role: "customer",
        status: "active",
        kycStatus: "verified",
        walletBalance: 44230,
        phone: "9999990001",
        address: {
          line1: "12 Demo Avenue",
          city: "Noida",
          state: "Uttar Pradesh",
          postalCode: "201301",
          country: "India",
        },
      },
      {
        name: "Priya Verma",
        email: "priya@finflow.demo",
        password: customerHash,
        role: "customer",
        status: "active",
        kycStatus: "verified",
        walletBalance: 21000,
        phone: "9999990002",
        address: {
          line1: "24 Sample Street",
          city: "Gurugram",
          state: "Haryana",
          postalCode: "122001",
          country: "India",
        },
      },
      {
        name: "Rohit Kumar",
        email: "rohit@finflow.demo",
        password: customerHash,
        role: "customer",
        status: "active",
        kycStatus: "verified",
        walletBalance: 13625,
        phone: "9999990003",
        address: {
          line1: "5 Demo Road",
          city: "Patna",
          state: "Bihar",
          postalCode: "800001",
          country: "India",
        },
      },
      {
        name: "Sneha Gupta",
        email: "sneha@finflow.demo",
        password: customerHash,
        role: "customer",
        status: "active",
        kycStatus: "pending",
        walletBalance: 4000,
        phone: "9999990004",
        address: {
          line1: "8 Sample Colony",
          city: "Jaipur",
          state: "Rajasthan",
          postalCode: "302001",
          country: "India",
        },
      },
      {
        name: "Kabir Mehta (Blocked Demo)",
        email: "blocked@finflow.demo",
        password: customerHash,
        role: "customer",
        status: "blocked",
        kycStatus: "rejected",
        walletBalance: 0,
        phone: "9999990005",
        address: {
          line1: "99 Fictional Lane",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
        },
      },
    ]);

    console.log("Creating demo transactions...");

    // Completed transactions match the displayed wallet balances.
    // Pending and failed transactions are UI test examples and
    // must not be included in the wallet balance calculations.
    const transactions = [
      // Aarav — balance ₹44,230
      makeTransaction({
        reference: "FF-DEMO-AARAV-OPEN",
        type: "credit",
        category: "add_money",
        amount: 40000,
        description: "Opening demo wallet balance",
        user: aarav,
        daysAgo: 18,
      }),
      makeTransaction({
        reference: "FF-DEMO-AARAV-TOPUP-01",
        type: "credit",
        category: "add_money",
        amount: 5000,
        description: "Demo wallet top-up",
        user: aarav,
        daysAgo: 8,
      }),
      makeTransaction({
        reference: "FF-DEMO-TRF-001-DR",
        type: "debit",
        category: "transfer",
        amount: 2500,
        description: "Sent to Priya Verma",
        user: aarav,
        counterparty: priya,
        daysAgo: 5,
        metadata: { recipientEmail: priya.email },
      }),
      makeTransaction({
        reference: "FF-DEMO-TRF-002-CR",
        type: "credit",
        category: "transfer",
        amount: 1250,
        description: "Received from Rohit Kumar",
        user: aarav,
        counterparty: rohit,
        daysAgo: 3,
        metadata: { senderEmail: rohit.email },
      }),
      makeTransaction({
        reference: "FF-DEMO-AARAV-FEE-01",
        type: "debit",
        category: "fee",
        amount: 20,
        description: "Demo service fee",
        user: aarav,
        daysAgo: 2,
      }),
      makeTransaction({
        reference: "FF-DEMO-AARAV-REFUND-01",
        type: "credit",
        category: "refund",
        amount: 500,
        description: "Demo transaction refund",
        user: aarav,
        daysAgo: 1,
      }),

      // Priya — balance ₹21,000
      makeTransaction({
        reference: "FF-DEMO-PRIYA-OPEN",
        type: "credit",
        category: "add_money",
        amount: 18000,
        description: "Opening demo wallet balance",
        user: priya,
        daysAgo: 17,
      }),
      makeTransaction({
        reference: "FF-DEMO-PRIYA-TOPUP-01",
        type: "credit",
        category: "add_money",
        amount: 1500,
        description: "Demo wallet top-up",
        user: priya,
        daysAgo: 7,
      }),
      makeTransaction({
        reference: "FF-DEMO-TRF-001-CR",
        type: "credit",
        category: "transfer",
        amount: 2500,
        description: "Received from Aarav Sharma",
        user: priya,
        counterparty: aarav,
        daysAgo: 5,
        metadata: { senderEmail: aarav.email },
      }),
      makeTransaction({
        reference: "FF-DEMO-TRF-003-DR",
        type: "debit",
        category: "transfer",
        amount: 1000,
        description: "Sent to Rohit Kumar",
        user: priya,
        counterparty: rohit,
        daysAgo: 4,
        metadata: { recipientEmail: rohit.email },
      }),

      // Rohit — balance ₹13,625
      makeTransaction({
        reference: "FF-DEMO-ROHIT-OPEN",
        type: "credit",
        category: "add_money",
        amount: 12000,
        description: "Opening demo wallet balance",
        user: rohit,
        daysAgo: 16,
      }),
      makeTransaction({
        reference: "FF-DEMO-ROHIT-TOPUP-01",
        type: "credit",
        category: "add_money",
        amount: 2000,
        description: "Demo wallet top-up",
        user: rohit,
        daysAgo: 6,
      }),
      makeTransaction({
        reference: "FF-DEMO-TRF-002-DR",
        type: "debit",
        category: "transfer",
        amount: 1250,
        description: "Sent to Aarav Sharma",
        user: rohit,
        counterparty: aarav,
        daysAgo: 3,
        metadata: { recipientEmail: aarav.email },
      }),
      makeTransaction({
        reference: "FF-DEMO-TRF-003-CR",
        type: "credit",
        category: "transfer",
        amount: 1000,
        description: "Received from Priya Verma",
        user: rohit,
        counterparty: priya,
        daysAgo: 4,
        metadata: { senderEmail: priya.email },
      }),
      makeTransaction({
        reference: "FF-DEMO-ROHIT-CASHOUT-01",
        type: "debit",
        category: "cash_out",
        amount: 125,
        description: "Demo cash-out",
        user: rohit,
        daysAgo: 2,
      }),

      // Sneha — pending KYC
      makeTransaction({
        reference: "FF-DEMO-SNEHA-OPEN",
        type: "credit",
        category: "add_money",
        amount: 4000,
        description: "Opening demo wallet balance",
        user: sneha,
        daysAgo: 10,
      }),
      makeTransaction({
        reference: "FF-DEMO-SNEHA-TOPUP-PENDING",
        type: "credit",
        category: "add_money",
        amount: 2500,
        description: "Demo top-up awaiting confirmation",
        user: sneha,
        status: "pending",
        daysAgo: 1,
      }),
      makeTransaction({
        reference: "FF-DEMO-SNEHA-TOPUP-FAILED",
        type: "credit",
        category: "add_money",
        amount: 1000,
        description: "Simulated failed top-up",
        user: sneha,
        status: "failed",
        daysAgo: 3,
      }),

      // Blocked customer — zero balance
      makeTransaction({
        reference: "FF-DEMO-BLOCKED-OPEN",
        type: "credit",
        category: "add_money",
        amount: 2500,
        description: "Opening demo wallet balance",
        user: blocked,
        daysAgo: 14,
      }),
      makeTransaction({
        reference: "FF-DEMO-BLOCKED-CASHOUT",
        type: "debit",
        category: "cash_out",
        amount: 2500,
        description: "Demo cash-out before account block",
        user: blocked,
        daysAgo: 9,
      }),
    ];

    await Transaction.insertMany(transactions);

    console.log("Creating demo beneficiaries...");

    await Beneficiary.insertMany([
      {
        owner: aarav._id,
        nickname: "Priya - Savings",
        email: priya.email,
        accountLast4: "4821",
        bankName: "HDFC Bank",
      },
      {
        owner: aarav._id,
        nickname: "Rohit - Main",
        email: rohit.email,
        accountLast4: "7359",
        bankName: "State Bank of India",
      },
      {
        owner: aarav._id,
        nickname: "Sample External Payee",
        email: "payee@finflow.demo",
        accountLast4: "1946",
        bankName: "ICICI Bank",
      },
      {
        owner: priya._id,
        nickname: "Aarav Sharma",
        email: aarav.email,
        accountLast4: "6102",
        bankName: "Axis Bank",
      },
      {
        owner: rohit._id,
        nickname: "Priya Verma",
        email: priya.email,
        accountLast4: "8840",
        bankName: "Kotak Mahindra Bank",
      },
    ]);

    console.log("Creating demo notifications...");

    await Notification.insertMany([
      makeNotification(
        aarav,
        "Welcome to FinFlow",
        "Your fictional demo wallet is ready to explore.",
        "info",
        true,
        18,
      ),
      makeNotification(
        aarav,
        "Wallet credited",
        "₹5,000 was added to your demo wallet.",
        "success",
        true,
        8,
      ),
      makeNotification(
        aarav,
        "Transfer completed",
        "₹2,500 sent to Priya Verma.",
        "success",
        false,
        5,
      ),
      makeNotification(
        aarav,
        "Security reminder",
        "Never share passwords or one-time codes.",
        "security",
        false,
        1,
      ),
      makeNotification(
        priya,
        "Money received",
        "₹2,500 received from Aarav Sharma.",
        "success",
        false,
        5,
      ),
      makeNotification(
        priya,
        "Profile verified",
        "Your demo KYC profile is marked as verified.",
        "info",
        true,
        14,
      ),
      makeNotification(
        rohit,
        "Transfer completed",
        "₹1,250 sent to Aarav Sharma.",
        "success",
        true,
        3,
      ),
      makeNotification(
        sneha,
        "KYC review pending",
        "Your demo KYC profile is awaiting admin review.",
        "warning",
        false,
        1,
      ),
      makeNotification(
        sneha,
        "Top-up pending",
        "A simulated top-up is awaiting confirmation.",
        "info",
        false,
        1,
      ),
      makeNotification(
        blocked,
        "Account restricted",
        "This demo account is blocked for admin workflow testing.",
        "security",
        false,
        9,
      ),
    ]);

    console.log("Creating demo audit logs...");

    await AuditLog.insertMany([
      makeAuditLog(
        admin,
        "DEMO_SEED_CREATED",
        "User",
        aarav._id,
        { note: "Fictional demo data created by seed script" },
        18,
      ),
      makeAuditLog(
        admin,
        "KYC_REVIEWED",
        "User",
        aarav._id,
        { status: "verified" },
        14,
      ),
      makeAuditLog(
        admin,
        "KYC_REVIEWED",
        "User",
        sneha._id,
        { status: "pending" },
        1,
      ),
      makeAuditLog(
        admin,
        "KYC_REVIEWED",
        "User",
        blocked._id,
        { status: "rejected" },
        9,
      ),
      makeAuditLog(
        admin,
        "USER_BLOCKED",
        "User",
        blocked._id,
        { reason: "Demo account for admin status testing" },
        9,
      ),
      makeAuditLog(
        aarav,
        "WALLET_TOPUP",
        "Transaction",
        "FF-DEMO-AARAV-TOPUP-01",
        { amount: 5000 },
        8,
      ),
      makeAuditLog(
        aarav,
        "MONEY_TRANSFER",
        "Transaction",
        "FF-DEMO-TRF-001-DR",
        { amount: 2500, recipient: priya.email },
        5,
      ),
      makeAuditLog(
        priya,
        "MONEY_TRANSFER",
        "Transaction",
        "FF-DEMO-TRF-003-DR",
        { amount: 1000, recipient: rohit.email },
        4,
      ),
    ]);

    console.log("\n✅ FinFlow demo data seeded successfully.");
    console.log("\n--- DEMO LOGIN CREDENTIALS ---");
    console.log("Admin:       admin@finflow.demo / Admin@12345");
    console.log("Verified:    demo@finflow.demo / Demo@12345");
    console.log("Verified:    priya@finflow.demo / Demo@12345");
    console.log("Verified:    rohit@finflow.demo / Demo@12345");
    console.log("KYC pending: sneha@finflow.demo / Demo@12345");
    console.log("Blocked:     blocked@finflow.demo / Demo@12345");

    console.log("\n--- DEMO WALLET BALANCES ---");
    console.log("Aarav:  ₹44,230");
    console.log("Priya:  ₹21,000");
    console.log("Rohit:  ₹13,625");
    console.log("Sneha:  ₹4,000");
    console.log("Blocked: ₹0");

    console.log("\n--- SEEDED RECORD COUNTS ---");
    console.log(
      "Users:",
      await User.countDocuments({
        email: { $in: demoEmails },
      }),
    );
    console.log(
      "Transactions:",
      await Transaction.countDocuments({
        user: {
          $in: [aarav._id, priya._id, rohit._id, sneha._id, blocked._id],
        },
      }),
    );
    console.log(
      "Beneficiaries:",
      await Beneficiary.countDocuments({
        owner: { $in: [aarav._id, priya._id, rohit._id] },
      }),
    );
    console.log(
      "Notifications:",
      await Notification.countDocuments({
        user: {
          $in: [aarav._id, priya._id, rohit._id, sneha._id, blocked._id],
        },
      }),
    );
    console.log(
      "Audit logs:",
      await AuditLog.countDocuments({
        actor: { $in: [admin._id, aarav._id, priya._id, rohit._id] },
      }),
    );
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((error) => {
  console.error("❌ FinFlow seed failed:", error);
  process.exitCode = 1;
});
