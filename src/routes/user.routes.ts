import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { protect,restrictTo } from "../middleware/auth.middleware";
import { updatePassword } from "../controllers/user.controller";

const router = Router();

router.put("/update-password",protect, updatePassword);
router.get("/", protect, restrictTo("Admin"), getAllUsers);


export default router;