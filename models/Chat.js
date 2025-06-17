import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
  {
    chatId: { type: String, unique: true },
    messages: [{ role: String, content: String }],
  },
  { timestamps: true }
);
export default mongoose.model("Chat", ChatSchema);
