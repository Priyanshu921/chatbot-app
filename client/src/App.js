import React,{ Suspense } from "react";
import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import { LoginOrRegister } from "./Component/LoginRegister/LoginOrRegister";
import SupportChat from "./Component/SupportChat/SupportChat";
import { ProtectedRoute } from "./protectedRoute";
const ChatBot = React.lazy(() => import("./Component/ChatBot"));

function App() {
  return (
      <Routes>
        <Route path="/" element={<Suspense
        fallback={
          <div className="loader-wrapper">
            <div className="loder-crcil"></div>
            <div className="text">Loading ...</div>
          </div>
        }
      >
        <ChatBot />
      </Suspense>}
      />
      <Route path="/login" element={<LoginOrRegister route="SignIn"/>}/>
      <Route path="/register" element={<LoginOrRegister route="SignUp"/>}/>
      <Route path="/support/chat" element={<ProtectedRoute><SupportChat/></ProtectedRoute>}/>
      </Routes>

  );
}

export default App;
