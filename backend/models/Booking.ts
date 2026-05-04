import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  voyage: mongoose.Types.ObjectId;
  departureDate: Date;
  travelers: number;
  phone?: string;
  specialRequests?: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  paymentIntentId?: string;
  totalPrice: number;
  serviceFee: number;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    voyage: { type: Schema.Types.ObjectId, ref: "Voyage", required: true },
    departureDate: Date,
    travelers: { type: Number, default: 1 },
    phone: String,
    specialRequests: String,
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PENDING",
    },
    paymentIntentId: String,
    totalPrice: Number,
    serviceFee: Number,
  },
  { timestamps: true },
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
