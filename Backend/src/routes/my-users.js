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
    let query = {};
    if (req.query.firstName) {
      query.firstName = { $regex: req.query.firstName, $options: "i" };
    }
    const users = await User.find(query).skip(skip).limit(pageSize);
    const total = await User.countDocuments(query);
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
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});
export default router;
