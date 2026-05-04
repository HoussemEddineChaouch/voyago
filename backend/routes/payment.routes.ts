import { Router, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});
const router = Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: ReturnType<typeof stripe.webhooks.constructEvent>;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as { id: string };
      await Booking.findOneAndUpdate(
        { paymentIntentId: pi.id },
        { status: "PAID" },
      );
    }

    res.json({ received: true });
  },
);

export default router;
