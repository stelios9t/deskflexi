import express from "express";
import Desk from "../model/desk.js";
import { body } from "express-validator";
import verifyToken from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
const router = express.Router();

router.post(
  "/",
  verifyToken,

  [
    body("deskNumber").notEmpty().isNumeric().withMessage("Number is required"),
    body("floor").notEmpty().isNumeric().withMessage("Floor is required"),
    body("amenities")
      .notEmpty()
      .isArray()
      .withMessage("Amenities are required"),
  ],
  async (req, res) => {
    console.log("Received request body:", req.body);
    try {
      const newDesk = {
        deskNumber: req.body.deskNumber,
        floor: req.body.floor,
        amenities: req.body.amenities,
      };

      const desk = new Desk(newDesk);
      await desk.save();

      res.status(201).send(desk);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.get("/", verifyToken, async (req, res) => {
  try {
    const pageSize = 10; // Define how many items you want per page
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    ); // Get the page number from query parameters or default to 1
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip

    const desks = await Desk.find().skip(skip).limit(pageSize); // Apply pagination
    const total = await Desk.countDocuments(); // Count the total documents

    // Return desks along with pagination details
    res.json({
      data: desks,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching desks" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id.toString();
  try {
    const desk = await Desk.findOne({
      _id: id,
    });
    res.json(desk);
  } catch (error) {
    res.status(500).json({ message: "Error fetching desks" });
  }
});

router.put("/:deskId", verifyToken, async (req, res) => {
  try {
    const updatedDesk = req.body;
    updatedDesk.lastUpdated = new Date();
    const desk = await Desk.findOneAndUpdate(
      {
        _id: req.params.deskId,
      },
      updatedDesk,
      { new: true }
    );
    if (!desk) {
      return res.status(404).json({ message: "Desk not found" });
    }
    await desk.save();
    res.status(201).json(desk);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
export default router;
