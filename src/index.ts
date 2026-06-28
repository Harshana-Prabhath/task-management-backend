import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.route";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import { globalErrorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"]; 

app.use(cors(
  {
    origin: (origin, callback) => {
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by secure cross-origin resource sharing policy."));
      }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }

));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes)

app.use(globalErrorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("MySQL Database successfully connected via TypeORM!");
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("TypeORM Database connection error: ", error));