import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User.entity";
import { sendSuccess } from "../utils/successResponse";

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
    const users = await userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return sendSuccess(res, users, "Users list retrieved successfully.");
  } catch (error) {
    next(error);
  }
};