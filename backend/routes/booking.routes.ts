import { Router } from "express";
import {
  createBooking,
  getBookings,
  cancelBooking,
  updateBookingStatus,
} from "../controllers/booking.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", protect, createBooking);
router.get("/", protect, getBookings);
router.delete("/:id", protect, authorize("USER", "ADMIN"), cancelBooking);
router.patch("/:id", protect, authorize("ADMIN"), updateBookingStatus);

export default router;
