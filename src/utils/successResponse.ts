import { Response } from "express";

export const sendSuccess = (
  res: Response, 
  data: any = null, 
  message = "Operation successful", 
  statusCode = 200
): void => {
  res.status(statusCode).json({
    status: "success",
    message,
    ...(data !== null && { data }),  
  });
};