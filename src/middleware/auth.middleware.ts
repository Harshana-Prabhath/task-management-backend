import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User.entity";

interface TokenPayload {
  userId: string;
  role: UserRole;
}


export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as TokenPayload;
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Access forbidden. You do not have permission to perform this action." });
      return;
    }
    next();
  };
};

export const authenticateJWT = protect;
export const requireAdmin = restrictTo(UserRole.ADMIN);

