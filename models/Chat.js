import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  time: String,
});

const ChatSchema = new mongoose.Schema({
  chatId: String,
  userId: String, // ✅ Make sure this exists
  title: String,
  messages: [MessageSchema],
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model("Chat", ChatSchema);
