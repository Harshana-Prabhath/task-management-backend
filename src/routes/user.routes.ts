import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { protect,restrictTo } from "../middleware/auth.middleware";

const router = Router();


router.get("/", protect, restrictTo("Admin"), getAllUsers);

export default router;