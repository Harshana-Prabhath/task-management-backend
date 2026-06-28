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

app.use(cors());
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