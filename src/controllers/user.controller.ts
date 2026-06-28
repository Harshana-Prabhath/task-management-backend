import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User.entity";
import { sendSuccess } from "../utils/successResponse";
import { AppError } from "../utils/appError";
import bcrypt from "bcryptjs";

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

export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.user!;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError("Current and new passwords are required.", 400));
    }

    
    const user = await userRepository.createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .addSelect("user.password") 
      .getOne();

    if (!user) {
      return next(new AppError("User session profile not found.", 404));
    }

    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return next(new AppError("The current password you entered is incorrect.", 400));
    }

    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

   
    await userRepository.save(user);

    return sendSuccess(res, null, "Security credentials updated successfully.");
  } catch (error) {
    next(error);
  }
};