import mongoose from "mongoose";

const deskSchema = new mongoose.Schema({
  deskNumber: { type: Number, required: true, unique: true },
  amenities: [{ type: String, required: true }],
  floor: { type: Number, required: true },
});

const Desk = mongoose.model("Desk", deskSchema);

export default Desk;
