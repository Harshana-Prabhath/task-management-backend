import { DataSource } from "typeorm";
import "reflect-metadata";
import dotenv from "dotenv";
import { User } from "../models/User.entity";
import { Task } from "../models/Task.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_management_db",
  synchronize: true, 
  logging: false,
  entities: [User, Task],
  migrations: [],
  subscribers: [],
});