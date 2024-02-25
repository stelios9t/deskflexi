import express from "express";
import { check, validationResult } from "express-validator";
import HttpError from "../model/http-error.js";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.post(
  "/login",
  [
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

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new HttpError("Invalid credentials", 400);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpError("Invalid credentials", 400);
      }

      // Attach user object to request
      req.user = user;

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      // req.user = { ...user.toObject(), role: user.role };

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user._id, role: user.role });
    } catch (error) {
      console.error(error);
      res
        .status(error.code || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
);

router.get("/validate-token", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; // Attach user object to req
    res.status(200).json({ userId: user._id, role: user.role });
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});
export default router;
