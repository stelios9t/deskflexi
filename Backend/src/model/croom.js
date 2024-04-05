import mongoose from "mongoose";

const croomSchema = new mongoose.Schema({
  croomNumber: { type: Number, required: true, unique: true },
  floor: { type: Number, required: true },
});

const Croom = mongoose.model("Croom", croomSchema);

export default Croom;
