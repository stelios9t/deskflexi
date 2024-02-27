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

// router.get("/:id", verifyToken, async (req, res) => {
//   const id = req.params.id.toString();
//   try {
//     const desk = await Desk.findOne({
//       _id: id,
//     });
//     res.json(desk);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching desks" });
//   }
// });
export default router;
