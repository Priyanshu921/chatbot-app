import express from 'express';
import { getChatReply, getChats, sendSupportChat } from '../controller/chat.controller';
const chatRoute = express();
chatRoute.post('/getReply',getChatReply)
chatRoute.post("/sendSupportChat", sendSupportChat);
chatRoute.get('/getChats/:ip',getChats)
export default chatRoute