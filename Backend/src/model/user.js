import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*\d)(?=.*[\W_]).{6,16}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid password. Password must be between 6 to 16 characters, including at least one number and one symbol.`,
    },
  },
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z]{1,16}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid first name. First name must be between 1 to 16 letters.`,
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z]{1,16}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid last name. Last name must be between 1 to 16 letters.`,
    },
  },
  role: { type: String, required: true },
  imageUrl: { type: String },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
