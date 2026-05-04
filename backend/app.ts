import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db";
import "./config/passport";

import paymentRoutes from "./routes/payment.routes";
import authRoutes from "./routes/auth.routes";
import destinationRoutes from "./routes/destination.routes";
import voyageRoutes from "./routes/voyage.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();
connectDB();

app.use("/payments", paymentRoutes);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/auth", authRoutes);
app.use("/destinations", destinationRoutes);
app.use("/voyages", voyageRoutes);
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`));
