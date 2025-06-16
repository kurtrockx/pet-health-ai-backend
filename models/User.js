import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  middleName: String,
  ext: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String, // hash this in production!
});

export default mongoose.model("User", userSchema);
