import express from "express";
import User from "../model/user.js";
import HttpError from "../model/http-error.js";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";
import verifyToken from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
import multer from "multer";
import cloudinary from "cloudinary";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
router.get("/me", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
router.post(
  "/register",
  verifyToken,
  checkRole("IT Admin"),
  upload.array("imageFile", 1),

  [
    check("firstName")
      .isAlpha()
      .withMessage("First name must contain only letters")
      .isLength({ min: 1, max: 15 })
      .withMessage("First name must be between 1 and 15 characters"),
    check("lastName")
      .isAlpha()
      .withMessage("Last name must contain only letters")
      .isLength({ min: 1, max: 15 })
      .withMessage("Last name must be between 1 and 15 characters"),
    check("role", "Role is required").isString(),
    check("email", "Email is required")
      .isEmail()
      .withMessage("Email must be a valid email address and include '@'")
      .matches(/@/)
      .withMessage("Email must include '@'"),
    check("password")
      .isLength({ min: 6, max: 16 })
      .withMessage("Password must be between 6 and 16 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[\W_]/)
      .withMessage("Password must contain at least one symbol"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        throw new HttpError("User already exists", 400);
      }

      if (req.user && req.user.role !== "IT Admin") {
        throw new HttpError("Unauthorized. Only IT Admins can register.", 403);
      }
      const imageFile = req.files;
      user = new User(req.body);
      const uploadPromises = imageFile.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });
      const imageUrl = await Promise.all(uploadPromises);
      user.imageUrl = imageUrl[0]; // Assuming only one image is uploaded
      await user.save();

      return res.status(200).json({ message: "User registered" });
    } catch (error) {
      console.error("Error in user registration:", error);

      if (error instanceof HttpError) {
        return res.status(error.code).json({ message: error.message });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong", error: error.message });
      }
    }
  }
);

export default router;
