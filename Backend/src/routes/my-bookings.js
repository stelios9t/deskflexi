import express from "express";
import Desk from "../model/desk.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for accurate date comparison

  try {
    const desks = await Desk.find({
      bookings: {
        $elemMatch: {
          userId: req.userId,
          checkIn: { $gte: today }, // Ensure booking check-in date is today or later
        },
      },
    });
    const results = desks
      .map((desk) => {
        const userBookings = desk.bookings.filter(
          (booking) => booking.userId === req.userId && booking.checkIn >= today
        );
        const deskWithUserBookings = {
          ...desk.toObject(),
          bookings: userBookings,
        };
        return deskWithUserBookings;
      })
      .filter((desk) => desk.bookings.length > 0); // Filter out desks with no relevant bookings

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});
export default router;
