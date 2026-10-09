import { Router } from "express";
import { list, create, remove } from "../controllers/beneficiaryController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.get("/", list);
router.post("/", create);
router.delete("/:id", remove);
export default router;
