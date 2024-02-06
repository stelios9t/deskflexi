import express from "express";
import Desk from "../model/desk.js";
import { body } from "express-validator";
import verifyToken from "../middleware/auth.js";
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
    const desks = await Desk.find();
    res.json(desks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

export default router;
