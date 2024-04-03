import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  userId: { type: String, required: true },
});
const croomSchema = new mongoose.Schema({
  croomNumber: { type: Number, required: true, unique: true },
  floor: { type: Number, required: true },
  bookings: [bookingSchema],
});

const Croom = mongoose.model("Croom", croomSchema);

export default Croom;
