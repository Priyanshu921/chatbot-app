import { chatBotData } from "../helper/chabotdata";
import { apiResponse } from "../helper/response"
import { chat } from "../models/chats";
import { user } from "../models/user";
import { socket } from "../socket";


export const getChatReply = async(req,res) => {
    try{
        const io = socket.getIo();
        const { utterances, answers, alternatives,suggestions } = chatBotData.getRules();
        let { text, talkingWithSupport } = req.body;
        let agentFound,reply,suggestion=["I want to talk with Agent"];
       if(!talkingWithSupport){
         if (text !== "I want to talk with Agent") {
           text = text
             .toLowerCase()
             .replace(/[^\w\s\d]/gi, "")
             .replace(/(\r\n|\r|\n)/g, "");
           for (let x = 0; x < utterances.length; x++) {
             for (let y = 0; y < utterances[x].length; y++) {
               if (utterances[x][y] === text) {
                 let items = answers[x];
                 reply = items[Math.floor(Math.random() * items.length)];
                 if (suggestions[x]) suggestion.push(...suggestions[x]);
               }
             }
           }
           const chatUpdated = await chat.insertMany([
             {
               ip: req.body.ip,
               userType: "user",
               message: req.body.text,
             },
             {
               ip: req.body.ip,
               userType: "bot",
               message:
                 reply ||
                 alternatives[Math.floor(Math.random() * alternatives.length)],
             },
           ]);
         } else {
           agentFound = await user
             .findOne({ online: true, available: true })
             .select("-password");
           if (agentFound) {
             const updateUser = await user.updateOne(
               { _id: agentFound._id },
               { available: false }
             );
           }
           const chatUpdated = await chat.insertMany([
             {
               ip: req.body.ip,
               userType: "user",
               message: req.body.text,
             },
             {
               ip: req.body.ip,
               userType: "bot",
               message: agentFound?"sure we will be connecting you with the bot":"No agent found, Please try later",
             },
           ]);
         }
         if (agentFound) {
           io.emit(`${agentFound._id}`, {
             ip: req.body.ip,
           });
         }
         io.emit(`${req.body.ip}`, {
           reply:
             reply ||
             alternatives[Math.floor(Math.random() * alternatives.length)],
           suggestions: agentFound ? "" : suggestion,
           agent: agentFound ? agentFound : "",
         });
       }
       else{
        const chatUpdated = await chat.insertMany([
          {
            ip: req.body.ip,
            userType: "user",
            message: req.body.text,
          },
        ]);
        io.emit(`${req.body.ip}`, {
          chatUpdated
        });
       }
        return apiResponse(res, {
          statusCode: 200,
          data: { reply:reply||alternatives[Math.floor(Math.random() * alternatives.length)] },
          message: "data fetched successfully",
        });
    }
    catch(error){
        console.log(error)
        return apiResponse(res,{statusCode:500,global_error:"problem while getting reply"})
    }
}

export const getChats = async(req,res)=> {
  const {ip} = req.params
  try{
    const chats = await chat.find({ip})
    apiResponse(res, {
          statusCode: 202,
          data: chats,
          message: "data fetched successfully",
        })
  }
  catch(error){
        console.log(error)
        return apiResponse(res,{statusCode:500,global_error:"problem while getting chats"})
    }
}

export const sendSupportChat = async(req,res) => {
  try{
    const {text,ip} = req.body;
    const io = socket.getIo();
    const chatUpdated = await chat.create({
      ip:ip,
      message:text,
      userType:"agent"
    })
    io.emit(`${req.body.ip}`, {
          message:"chat updated"
        });
    return apiResponse(res,{statusCode:200,data:{},message:"message sent"})
  }
  catch(error){
    console.log(error)
    return apiResponse(res,{statusCode:400,global_error:"problem while updating chat"})
  }
}