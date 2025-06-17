import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  userId: {
    type: String, // ✅ store as plain string
    required: true,
  },
  petName: String,
  petType: String,
  breed: String,
  age: Number,
  weight: Number,
  gender: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
