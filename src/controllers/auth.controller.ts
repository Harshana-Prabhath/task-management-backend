import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { User, UserRole } from "../models/User.entity.js";
import { AppError } from "../utils/appError.js";
import { sendSuccess } from "../utils/successResponse.js";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, role } = req.body;

   
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError("User with this email already exists.", 400));
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

   
    const newUser = userRepository.create({
      email,
      password: hashedPassword,
      role: role || UserRole.USER, 
    });

    await userRepository.save(newUser);

   
    return sendSuccess(res, null, "User registered successfully!", 201);
  } catch (error) {
  
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("Invalid email or password.", 400));
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(new AppError("Invalid email or password.", 400));
    }

  
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as SignOptions
    );

    
    return sendSuccess(
      res,
      {
        token,
        user: { id: user.id, email: user.email, role: user.role },
      },
      "Login successful!"
    );
  } catch (error) {
    next(error);
  }
};