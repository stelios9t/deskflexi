import express from "express";
import Desk from "../model/desk.js";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    console.log("Received query parameters:", req.query); // Log the received query parameters
    const query = constructSearchQuery(req.query);
    console.log("Constructed query:", query); // Log the constructed query

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const desks = await Desk.find(query).skip(skip).limit(pageSize);
    const total = await Desk.countDocuments(query);
    const response = {
      data: desks,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error", error);
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
    const newBooking = {
      ...req.body,
      userId: req.userId,
    };
    const desk = await Desk.findOneAndUpdate(
      { _id: req.params.deskId },
      {
        $push: { bookings: newBooking },
      }
    );
    if (!desk) {
      return res.status(400).json({ message: "desk not found" });
    }
    await desk.save();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
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
