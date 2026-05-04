import { Response } from "express";
import Stripe from "stripe";
import Booking from "../models/Booking";
import Voyage from "../models/Voyage";
import { AuthRequest } from "../middleware/auth.middleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const SERVICE_FEE = 49;

// POST /bookings — create booking + Stripe Payment Intent
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { voyageId, travelers, departureDate, phone, specialRequests } =
      req.body;

    const voyage = await Voyage.findById(voyageId);
    if (!voyage) return res.status(404).json({ message: "Voyage not found" });

    const totalPrice = voyage.price * Number(travelers) + SERVICE_FEE;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Stripe uses cents
      currency: "usd",
      metadata: { voyageId, userId: req.user._id.toString() },
    });

    const booking = await Booking.create({
      user: req.user._id,
      voyage: voyageId,
      travelers: Number(travelers),
      departureDate,
      phone,
      specialRequests,
      status: "PENDING",
      paymentIntentId: paymentIntent.id,
      totalPrice,
      serviceFee: SERVICE_FEE,
    });

    res
      .status(201)
      .json({ booking, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: "Booking creation failed", error: err });
  }
};

// GET /bookings — ADMIN gets all, USER gets own
export const getBookings = async (req: AuthRequest, res: Response) => {
  const filter = req.user.role === "ADMIN" ? {} : { user: req.user._id };
  const bookings = await Booking.find(filter)
    .populate("voyage", "title image price")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

// DELETE /bookings/:id — User cancels (refunds if PAID)
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: { $in: ["PENDING", "PAID"] },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or cannot be cancelled" });
    }

    // If PAID → refund via Stripe
    if (booking.status === "PAID" && booking.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json({ message: "Booking cancelled and refund issued", booking });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Cancellation failed", error: err.message });
  }
};

// PATCH /bookings/:id — Admin changes status (refunds if setting to CANCELLED)
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // If admin is cancelling a PAID booking → refund
    if (
      status === "CANCELLED" &&
      booking.status === "PAID" &&
      booking.paymentIntentId
    ) {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });
    }

    // If admin sets back to PENDING from PAID — no refund, just status change
    booking.status = status;
    await booking.save();

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Status update failed", error: err.message });
  }
};
