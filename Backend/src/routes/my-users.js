import express from "express";
import User from "../model/user.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const pageSize = 5; // Define how many items you want per page
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    ); // Get the page number from query parameters or default to 1
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip

    const users = await User.find().skip(skip).limit(pageSize);
    const total = await User.countDocuments();
    res.json({
      data: users,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id.toString();
  try {
    const user = await User.findOne({
      _id: id,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/:userId", verifyToken, async (req, res) => {
  try {
    const updatedUser = req.body;
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      updatedUser,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
export default router;
