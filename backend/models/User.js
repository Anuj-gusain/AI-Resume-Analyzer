import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);