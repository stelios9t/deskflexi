import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  userId: { type: String, required: true },
});
const deskSchema = new mongoose.Schema({
  deskNumber: { type: Number, required: true, unique: true },
  amenities: [{ type: String, required: true }],
  floor: { type: Number, required: true },
  bookings: [bookingSchema],
});

const Desk = mongoose.model("Desk", deskSchema);

export default Desk;
