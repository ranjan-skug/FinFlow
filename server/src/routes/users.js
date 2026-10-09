import { Router } from "express";
import { submitKyc, profile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.get("/profile", profile);
router.post("/kyc", submitKyc);
export default router;
