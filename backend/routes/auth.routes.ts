import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  verifyOTP,
  forgotPassword,
  updateProfile,
  resetPassword,
  getMe,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.put("/profile", protect, updateProfile);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=oauth`,
  }),
  (req: any, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    res.redirect(
      `${process.env.CLIENT_URL}/auth/google-callback?token=${token}`,
    );
  },
);
router.get('/me', protect, getMe);
router.post("/reset-password", resetPassword);
export default router;
