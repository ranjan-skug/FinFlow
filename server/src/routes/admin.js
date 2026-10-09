import { Router } from "express";
import { dashboard, audits } from "../controllers/adminController.js";
import {
  listUsers,
  setUserStatus,
  reviewKyc,
} from "../controllers/userController.js";
import { protect, requireRole } from "../middleware/auth.js";
const router = Router();
router.use(protect, requireRole("admin"));
router.get("/dashboard", dashboard);
router.get("/users", listUsers);
router.patch("/users/:id/status", setUserStatus);
router.patch("/users/:id/kyc", reviewKyc);
router.get("/audit-logs", audits);
export default router;
