import { Router } from "express";
import {
  addMoney,
  transfer,
  transactions,
} from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.post("/add-money", addMoney);
router.post("/transfer", transfer);
router.get("/transactions", transactions);
export default router;
