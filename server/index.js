import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { socket } from "./socket.js";
import { chatBotData } from "./helper/chabotdata.js";
import chatRoute from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();
app.use(cors());
app.use(express.urlencoded())
app.use(express.json())
app.use('/chat',chatRoute)
app.use('/user',userRoutes)
mongoose
  .connect(
    "mongodb+srv://priyanshu:priyanshu921@naruto.sf8tp46.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    const server = app.listen(3001, async () => {
      try {
        const chatbotdata = await chatBotData.setRules();
      } catch (error) {
        throw new Error("problem while finding chatBot Rules");
      }
    });
    const io = socket.io(server);
    console.log("Server running on port: 3001")
  })
  .catch(error=> {throw new Error("Database not available")})
