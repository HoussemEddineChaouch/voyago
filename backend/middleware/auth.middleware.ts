import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
