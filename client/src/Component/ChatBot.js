import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import io from "socket.io-client";
import axios from "axios";
import Robot from "../Images/Robot.png";
import user from "../Images/user.png";

const ChatBot = () => {
  const chatBody = useRef();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [args,setArgs] = useState([])
  const [subheading,setSubHeading] = useState("We typically reply in a few minutes")
  // let ip = ""
  const [talkingWithSupport,setTalkingWithSupport] = useState(false)
  const [ip,setIp] = useState()
  
  useEffect(()=>(
    async()=>{
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    setIp(data.ip)
    io("ws://localhost:3001/").on(`${data.ip}`, async (args) => {
     if (args?.agent?.name) {
       setSubHeading("You are now chatting with " + args?.agent?.name);
       setTalkingWithSupport(true)
     }
     if (args?.agent?.email) {
      console.log({ email: args?.agent?.email });
     io("ws://localhost:3001/").on(`${args?.agent?.email}`,()=>{
       window.alert("agent logged out")
        setSubHeading("We typically reply in a few minutes");
        setTalkingWithSupport(false);
     })
    }
   setArgs(args?.suggestions||[]);
    getMessages(data.ip);
    });
    getMessages(data.ip);
    // Set the IP address to the constant `ip`
  }),[])
  
  useEffect(() => {
    scrollMessages();
  }, [chats]);

  const sendChat = (event) => {
    event?.preventDefault();
    setChats([...chats, { userType: "user", message: event?.message || message }]);
    axios.post("http://localhost:3001/chat/getReply", {
      text: event?.message || message,
      ip: ip,
      talkingWithSupport,
    });
    setMessage("");
  };
  const scrollMessages = () => {
    chatBody.current.scrollIntoView();
  };

  const getMessages = async (ip) => {
    const getMessages = await axios.get(
      "http://localhost:3001/chat/getChats/" + ip
    );
    setChats(getMessages?.data?.data);
  };
  return (
    <>
      <div className="container">
        <div className="d-flex align-items-center justify-content-center border rounded mx-auto w-50 mt-3 bg-secondary position-relative">
          <div className="w-100 bg-light rounded m-2 header">
            <div className="bg-dark text-white rounded-top p-2">
              <div className="row mt-2 ms-2">
                <div className="col-sm-2 position-relative">
                  <img
                    src={Robot}
                    className="imgBlock border-circle"
                    alt="robot"
                  />
                </div>
                <div className="col-sm-8">
                  <p className="textSpacing">ChatBot</p>
                  <p>{subheading}</p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="chatMessages">
                {chats.map((chat) =>
                  chat.userType === "bot" || chat.userType === "agent" ? (
                    <div className="row px-3">
                      <div className="col-sm-1 position-relative pe-0 me-4">
                        <img
                          className="rounded-circle position-absolute imgBlock"
                          src={Robot}
                          alt="robot"
                        />
                      </div>
                      <div className="col-sm-8 ps-0 mt-2">
                        <p className="chatColor rounded p-2 textSize">
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-sm-8 ms-auto mt-2">
                        <p className="chatColor2 rounded p-2 textSize">
                          {chat.message}
                        </p>
                      </div>
                      <div className="col-sm-2 position-relative float-right">
                        <img
                          className="rounded-circle border border-dark position-absolute imgBlock2"
                          src={user}
                          alt="user"
                        />
                      </div>
                    </div>
                  )
                )}
                <div className="d-flex" ref={chatBody}>
                  {args.length !== 0 &&
                    args.map((arg) => {
                      return (
                        <button
                          className="btn btn-dark my-2 mx-1"
                          onClick={() => {
                            sendChat({
                              message: arg,
                              preventDefault: () => {},
                            });
                          }}
                        >
                          {arg}
                        </button>
                      );
                    })}
                </div>
              </div>
              <form onSubmit={sendChat} className="">
                <div className="d-flex chatInputBox">
                  <div className="col-sm-10 me-2">
                    <textarea
                      type="text"
                      value={message}
                      className="w-100 h-100 chatTextInput shadow-none"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-4 buttonSpacing">
                    <button
                      type="submit"
                      disabled={!message}
                      className="btn btn-secondary"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
