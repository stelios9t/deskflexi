import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import myDeskRoutes from "./routes/my-desks.js";
import deskRoutes from "./routes/desks.js";
import path from "path";
import myUserRoutes from "./routes/my-users.js";
import bookingRoutes from "./routes/my-bookings.js";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-desks", myDeskRoutes);
app.use("/api/desks", deskRoutes);
app.use("/api/my-users", myUserRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});
app.listen(3000);
