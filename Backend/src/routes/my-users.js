import express from "express";
import { body } from "express-validator";
import User from "../model/user.js";
import verifyToken from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
const router = express.Router();

router.get("/", verifyToken, checkRole("IT Admin"), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.get("/:id", checkRole("IT ADMIN"), verifyToken, async (req, res) => {
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
