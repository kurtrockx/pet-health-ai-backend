import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  petName: String,
  petType: String,
  breed: String,
  age: Number,
  weight: Number,
  gender: String,
  imageUrl: String, // ✅ Add this line
  createdAt: { type: Date, default: Date.now },
});

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
