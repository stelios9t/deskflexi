import express from "express";
import { body } from "express-validator";
import verifyToken from "../middleware/auth.js";
import Croom from "../model/croom.js";
const router = express.Router();
router.post(
  "/",
  verifyToken,

  [
    body("croomNumber")
      .notEmpty()
      .isNumeric()
      .withMessage("Number is required"),
    body("floor").notEmpty().isNumeric().withMessage("Floor is required"),
  ],
  async (req, res) => {
    console.log("Received request body:", req.body);
    try {
      const newCroom = {
        croomNumber: req.body.croomNumber,
        floor: req.body.floor,
      };

      const croom = new Croom(newCroom);
      await croom.save();

      res.status(201).send(croom);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.get("/", verifyToken, async (req, res) => {
  try {
    const pageSize = 10;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    let query = {};
    if (req.query.croomNumber) {
      query.croomNumber = req.query.croomNumber;
    }

    const crooms = await Croom.find(query).skip(skip).limit(pageSize);
    const total = await Croom.countDocuments(query);

    res.json({
      data: crooms,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching crooms" });
  }
});
router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id.toString();
  try {
    const croom = await Croom.findOne({
      _id: id,
    });
    res.json(croom);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conference rooms" });
  }
});

router.put("/:croomId", verifyToken, async (req, res) => {
  try {
    const updatedCroom = req.body;
    updatedCroom.lastUpdated = new Date();
    const croom = await Croom.findOneAndUpdate(
      {
        _id: req.params.croomId,
      },
      updatedCroom,
      { new: true }
    );
    if (!croom) {
      return res.status(404).json({ message: "Conference Room not found" });
    }
    await croom.save();
    res.status(201).json(croom);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.delete("/:croomId", verifyToken, async (req, res) => {
  try {
    const { croomId } = req.params;
    const croom = await Croom.findByIdAndDelete(croomId);

    if (!croom) {
      return res.status(404).json({ message: "Conference Room not found" });
    }

    res.status(200).json({ message: "Conference Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting desk:", error);
    res.status(500).json({ message: "Error deleting conference room" });
  }
});
export default router;
