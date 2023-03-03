import mongoose from "mongoose";
const chatBotRuleDataSchema = new mongoose.Schema({
  utterances: {
    type: [[String]],
    required: true,
  },
  answers: {
    type: [[String]],
    required: true,
  },
  suggestion:{
     type: [[String]],
    required: true,
  },
  alternatives: {
    type: [String],
    required: true,
  },
});

export const chatbotRuleData = mongoose.model("chatrule", chatBotRuleDataSchema,'chat-bot-rules');