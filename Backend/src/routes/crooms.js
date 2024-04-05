import express from "express";
import Croom from "../model/croom.js";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import moment from "moment-timezone";

const router = express.Router();
const parseDate = (
  dateStr,
  format = "YYYY-MM-DD HH:mm",
  timezone = "Europe/Athens"
) => {
  console.log(
    `Parsing date: ${dateStr} with format: ${format} and timezone: ${timezone}`
  );
  const date = moment.tz(dateStr, format, timezone);
  if (!date.isValid()) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  console.log(`Parsed date is valid: ${date.toDate()}`);
  return date.toDate(); // Convert to JavaScript Date object
};

const checkCheckoutAfterCheckin = (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.body;
    // Ensure dates are parsed according to the specified format and timezone
    const checkInDate = parseDate(checkIn, "YYYY-MM-DD HH:mm", "Europe/Athens");
    const checkOutDate = parseDate(
      checkOut,
      "YYYY-MM-DD HH:mm",
      "Europe/Athens"
    );

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    }
    next();
  } catch (error) {
    // Capture and return any parsing errors
    return res.status(400).json({ message: error.message });
  }
};
const checkDuration = (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.body;
    const checkInDate = parseDate(checkIn, "YYYY-MM-DD HH:mm", "Europe/Athens");
    const checkOutDate = parseDate(
      checkOut,
      "YYYY-MM-DD HH:mm",
      "Europe/Athens"
    );

    const duration = moment
      .duration(moment(checkOutDate).diff(moment(checkInDate)))
      .asMinutes();

    if (duration < 30 || duration > 180) {
      return res.status(400).json({
        message: "Booking duration must be between 30 minutes and 3 hours",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid date format" });
  }
};

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Conference Room ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
      const croom = await Croom.findById(id);
      res.json(croom);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching croom" });
    }
  }
);

export default router;
