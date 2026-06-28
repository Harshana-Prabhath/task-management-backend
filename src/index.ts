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
        callback(null, false);
      }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }

));
app.use(express.json());

app.use(async (req, res, next) => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("MySQL Database dynamically connected via TypeORM!");
    } catch (error) {
      console.error("TypeORM lazy-initialization error: ", error);
      return res.status(500).json({ message: "Database connection failure." });
    }
  }
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes)

app.use(globalErrorHandler);

if (process.env.NODE_ENV !== "production") {
  AppDataSource.initialize()
    .then(() => {
      console.log("MySQL Database successfully connected via TypeORM locally!");
      app.listen(PORT, () => {
        console.log(`Server running locally on http://localhost:${PORT}`);
      });
    })
    .catch((error) => console.error("Local database initialization error: ", error));
}


export default app;