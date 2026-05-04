import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: `"Voyago" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Voyago verification code",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#2563EB">Voyago</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:8px;color:#0F172A">${otp}</h1>
        <p style="color:#6B7280">Expires in 10 minutes.</p>
      </div>
    `,
  });
};

// POST /auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 12);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpires,
    });
    await sendOTP(email, otp);

    res.status(201).json({
      message: "Registered. Check your email for OTP.",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/verify-otp
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id.toString());
    res.json({ message: "Account verified successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account with that email" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTP(email, otp);
    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, country } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, country },
      { new: true },
    ).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashed = await bcrypt.hash(password, 12);
    user.password = hashed;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -otp -otpExpires",
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
