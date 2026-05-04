import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  phone?: string;
  country?: string;
  otp?: string;
  otpExpires?: Date;
  googleId?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    isVerified: { type: Boolean, default: false },
    phone: String,
    country: String,
    otp: String,
    otpExpires: Date,
    googleId: String,
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
