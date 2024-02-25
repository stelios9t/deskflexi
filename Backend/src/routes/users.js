import express from "express";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import HttpError from "../model/http-error.js";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";
import verifyToken from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

router.post(
  "/register",
  verifyToken, // Assuming this middleware verifies token
  checkRole("IT Admin"), // Middleware to check role

  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("role", "Role is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
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

      // Assuming req.user is populated after the verifyToken middleware
      if (req.user && req.user.role !== "IT Admin") {
        throw new HttpError("Unauthorized. Only IT Admins can register.", 403);
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.status(200).send({ message: "User registered" });
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
