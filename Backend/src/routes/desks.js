import express from "express";
import Desk from "../model/desk.js";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = constructSearchQuery(req.query);
    const desks = await Desk.find(query);
    res.json({ data: desks });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Desk ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
      const desk = await Desk.findById(id);
      res.json(desk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching desk" });
    }
  }
);
router.post("/:deskId/bookings", verifyToken, async (req, res) => {
  try {
    const { checkIn } = req.body;
    const deskId = req.params.deskId;
    const userId = req.userId;

    const toMidnight = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const requestedCheckIn = toMidnight(checkIn);

    // Check for any existing booking by this user on the specified date across all desks
    const existingBooking = await Desk.findOne({
      "bookings.userId": userId,
      "bookings.checkIn": requestedCheckIn,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You have already booked a desk for this date.",
      });
    }

    const newBooking = {
      userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      checkIn: requestedCheckIn,
      // Assuming checkOut is not used as per new system's logic
      checkOut: requestedCheckIn,
    };

    const desk = await Desk.findByIdAndUpdate(
      deskId,
      { $push: { bookings: newBooking } },
      { new: true, runValidators: true }
    );

    if (!desk) {
      return res.status(400).json({ message: "Desk not found" });
    }

    res.status(200).json(desk);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong during the booking process." });
  }
});
router.delete(
  "/:deskId/bookings",
  verifyToken,
  [param("deskId").notEmpty().withMessage("Desk ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, checkIn } = req.body; // Assuming you pass userId and checkIn to identify the booking
    const deskId = req.params.deskId;
    const toMidnight = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };
    const requestedCheckIn = toMidnight(checkIn);

    try {
      const updatedDesk = await Desk.findOneAndUpdate(
        {
          _id: deskId,
          "bookings.userId": userId,
          "bookings.checkIn": requestedCheckIn,
        },
        { $pull: { bookings: { userId: userId, checkIn: requestedCheckIn } } },
        { new: true }
      );

      if (!updatedDesk) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res
        .status(200)
        .json({ message: "Booking cancelled successfully", data: updatedDesk });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error cancelling booking" });
    }
  }
);

const constructSearchQuery = (queryParams) => {
  let constructedQuery = {};

  if (queryParams.deskNumber !== undefined && queryParams.deskNumber !== "") {
    constructedQuery.deskNumber = parseInt(queryParams.deskNumber);
  }

  if (queryParams.amenities) {
    constructedQuery.amenities = {
      $all: Array.isArray(queryParams.amenities)
        ? queryParams.amenities
        : [queryParams.amenities],
    };
  }

  return constructedQuery;
};

export default router;
