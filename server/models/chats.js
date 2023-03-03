import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const chat = mongoose.model("chat", chatSchema, "chats");
