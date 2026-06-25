import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  
  if (process.env.NODE_ENV === "production") {
    res.status(statusCode).json({
      status: "error",
      message: err.isOperational ? message : "Something went wrong!",
    });
  } else {
    
    res.status(statusCode).json({
      status: "error",
      message,
      stack: err.stack,
    });
  }
};