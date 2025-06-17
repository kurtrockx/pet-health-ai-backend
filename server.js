import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";
import Chat from "./models/Chat.js";
import { fetchLlama } from "./aiService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========== USER REGISTRATION ==========
app.post("/api/register", async (req, res) => {
  try {
    const { lastName, firstName, middleName, ext, email, username, password } =
      req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email or username already exists" });
    }

    const newUser = new User({
      lastName,
      firstName,
      middleName,
      ext,
      email,
      username,
      password,
    });

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// ========== USER LOGIN ==========
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ========== AI CHAT ENDPOINT ==========
app.post("/api/llama3", async (req, res) => {
  const { chatId, message } = req.body;

  try {
    let chat = await Chat.findOne({ chatId });
    if (!chat) {
      chat = new Chat({ chatId, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });

    const aiReply = await fetchLlama(chat.messages); // This is your LLM call

    chat.messages.push({ role: "assistant", content: aiReply });
    chat.updatedAt = new Date(); // Ensure updatedAt is set
    await chat.save();

    res.json({ response: aiReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// ========== CHAT HISTORY ==========
app.get("/api/chatHistory", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const chatHistory = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json({ chatHistory });
  } catch (err) {
    console.error("Error loading chat history:", err);
    res.status(500).json({ error: "Failed to load chat history" });
  }
});

app.post("/api/saveChat", async (req, res) => {
  try {
    const { chatId, title, messages, createdAt, updatedAt, userId } = req.body;

    if (!chatId || !messages || !userId) {
      console.log("⛔ Missing fields:", { chatId, messages, userId });
      return res.status(400).json({ error: "Missing required fields" });
    }

    let chat = await Chat.findOneAndUpdate(
      { chatId, userId },
      {
        chatId,
        title,
        messages,
        createdAt,
        updatedAt,
        userId,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Chat saved", chat });
  } catch (err) {
    console.error("❌ Error saving chat:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
