import React, { useState, useRef, useEffect } from "react";
import supportStyle from "./SupportChat.module.css";
import io from "socket.io-client";
import axios from "axios";
import Robot from "../../Images/Robot.png";
import userImage from "../../Images/user.png";
import { Link, useNavigate } from "react-router-dom";

const SupportChat = () => {
  const navigate = useNavigate()
  const userJSON = localStorage.getItem("qpwoeirutyalskdjfhgzmxncb");
  const chatBody = useRef();
  const [user,setUser] = useState(JSON.parse(userJSON))
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [args,setArgs] = useState([''])
  // let ip = ""
  const [ip, setIp] = useState(JSON.parse(userJSON)?.ip);
  
  useEffect(()=>{
      // async()=>{ 
        io("ws://localhost:3001/").on(`${user._id}`, async (data) => {
          if(data.ip){setIp(data.ip)
          io("ws://localhost:3001/").on(`${data.ip}`, async (arg) => {
            setArgs(arg?.suggestions || []);
            getMessages(data.ip);
          });
          getMessages(data.ip);}
        });
          getMessages(args.ip);
          // Set the IP address to the constant `ip`
        // }
      },[])
        
        useEffect(() => {
    scrollMessages();
  }, [chats]);

  const handleLogout = () => {
    axios.post("http://localhost:3001/user/logout", {
      email: user.email,
    });
    localStorage.removeItem("qpwoeirutyalskdjfhgzmxncb");
    navigate('/login')
  }

  const sendChat = (event) => {
    console.log(ip)
    event?.preventDefault();
    setChats([...chats, { userType: "agent", message: event?.message || message }]);
    axios.post("http://localhost:3001/chat/sendSupportChat", {
      text: event?.message || message,
      ip: ip,
      fromAgent: true,
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">
            ChatBot
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse  float-end"
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav">
              <button
                className="nav-link border-0 bg-transparent disabled"
                aria-current="page"
                href="#"
              >
                Hello {user?.name}
              </button>
              <button
                className="nav-link border-0 bg-transparent"
                onClick={handleLogout}
                aria-current="page"
                href="#"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="d-flex align-items-center justify-content-center border rounded mx-auto w-50 mt-3 bg-secondary position-relative">
          <div className="w-100 bg-light rounded m-2 header">
            <div className="bg-dark text-white rounded-top p-2">
              <div className="row mt-2 ms-2">
                <div className="col-sm-2 position-relative">
                  <img
                    src={Robot}
                    className={supportStyle.imgBlock + " border-circle"}
                    alt="robot"
                  />
                </div>
                <div className="col-sm-8">
                  <p className={supportStyle.textSpacing}>ChatBot</p>
                  <p>We typically reply in a few minutes</p>
                </div>
              </div>
            </div>
            <div className="">
              <div className={supportStyle.chatMessages}>
                {chats.map((chat) =>
                  chat.userType === "user" ? (
                    <div className="row px-3">
                      <div className="col-sm-1 position-relative pe-0 me-4">
                        <img
                          className={
                            "rounded-circle border border-dark position-absolute " +
                            supportStyle.imgBlock
                          }
                          src={userImage}
                          alt="robot"
                        />
                      </div>
                      <div className="col-sm-8 ps-0 mt-2">
                        <p
                          className={
                            supportStyle.chatColor +
                            " rounded p-2 " +
                            supportStyle.textSize
                          }
                        >
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-sm-8 ms-auto mt-2">
                        <p
                          className={
                            supportStyle.chatColor2 +
                            " rounded p-2 " +
                            supportStyle.textSize
                          }
                        >
                          {chat.message}
                        </p>
                      </div>
                      <div className="col-sm-2 position-relative float-right">
                        <img
                          className={
                            "rounded-circle position-absolute " +
                            supportStyle.imgBlock2
                          }
                          src={Robot}
                          alt="user"
                        />
                      </div>
                    </div>
                  )
                )}
                <div className="d-flex" ref={chatBody}></div>
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
                  <div className={"col-sm-4 " + supportStyle.buttonSpacing}>
                    <button
                      type="submit"
                      disabled={!message||!ip}
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

export default SupportChat;
