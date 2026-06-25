import { Router } from "express";
import { 
  createTask, 
  getAllTasks, 
  getTaskById, 
  updateTask, 
  deleteTask 
} from "../controllers/task.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();


router.use(authenticateJWT);


router.post("/", createTask);         
router.get("/", getAllTasks);        
router.get("/:id", getTaskById);      
router.put("/:id", updateTask);       
router.delete("/:id", deleteTask);   

export default router;