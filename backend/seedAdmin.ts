import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User"; // adjust path
import bcrypt from "bcryptjs";

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    });

    console.log("Admin created:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAdmin();
