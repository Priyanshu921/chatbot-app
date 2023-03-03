import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginRegisterStyle from "./LoginRegister.module.css";
export const LoginOrRegister = ({ route }) => {
  const navigate = useNavigate()
  const [active, setActive] = useState(route);
  //register variables
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //login variables
  const [loginUser,setLoginUser] = useState({
    email:"",
    password:""
  })
  const [loginError,setLoginError] = useState({
    email:"",
    password:""
  })
  const Signup = () => {
    setActive("SignUp");
  };
  const Signin = () => {
    setActive("SignIn");
  };

  const handleChange = (e, type) => {
    if (type === "register") {
      setRegisterUser({ ...registerUser, [e.target.name]: e.target.value });
    }
    if(type === 'login'){
      setLoginUser({...loginUser,[e.target.name]:e.target.value})
    }
  };

  const handleBlur = (e, type) => {
    if (type === "register") {
      switch (e.target.name) {
        case "name":
          if (registerUser.name === "") {
            setRegisterError({
              ...registerError,
              name: "Please enter name",
            });
          } else {
            setRegisterError({ ...registerError, name: "" });
          }
          break;
        case "password":
          if (registerUser.password === "") {
            setRegisterError({
              ...registerError,
              password: "Please enter valid password",
            });
          } else if (
            registerUser.confirmPassword &&
            registerUser.password !== registerUser.confirmPassword
          ) {
            setRegisterError({
              ...registerError,
              password: "Passwords don't match",
              confirmPassword: "Passwords don't match",
            });
          } else {
            setRegisterError({
              ...registerError,
              password: "",
              confirmPassword: "",
            });
          }
          break;
        case "confirmPassword":
          if (registerUser.confirmPassword === "") {
            setRegisterError({
              ...registerError,
              confirmPassword: "Please re enter password",
            });
          } else if (
            registerUser.password &&
            registerUser.password !== registerUser.confirmPassword
          ) {
            setRegisterError({
              ...registerError,
              password: "Passwords don't match",
              confirmPassword: "Passwords don't match",
            });
          } else {
            setRegisterError({ ...registerError, confirmPassword: "" });
          }
          break;
        case "email":
          if (registerUser.email === "") {
            setRegisterError({
              ...registerError,
              email: "Please enter email",
            });
          } else if (
            !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(registerUser.email)
          ) {
            setRegisterError({
              ...registerError,
              email: "Please enter valid email",
            });
          } else {
            setRegisterError({ ...registerError, email: "" });
          }
          break;
        default:
          break;
      }
    } else if (type === "login") {
      switch(e.target.name){
        case 'email':
          if (loginUser.email === "") {
            setLoginError({
              ...loginError,
              email: "Please enter email",
            });
          } else if (
            !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(loginUser.email)
            ) {
            console.log(
              /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(loginUser.email)
            );
            setLoginError({
              ...loginError,
              email: "Please enter valid email",
            });
          } else {
            setLoginError({ ...loginError, email: "" });
          }
          break;
          default:
            break;
      }
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    const userRegistered = await axios.post(
      "http://localhost:3001/user/register",
      { ...registerUser }
    );
    setRegisterUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setActive("SignIn");
  };

  const handleUserLogin = async(e)=> {
    e.preventDefault();
    const userLoggedIn = await axios.post(
      "http://localhost:3001/user/login",
      {...loginUser}
    );
    localStorage.setItem("qpwoeirutyalskdjfhgzmxncb",JSON.stringify(userLoggedIn.data?.data));
    navigate("/support/chat");
  }

  return (
    <div className={`${LoginRegisterStyle.container}`}>
      <div className={`${LoginRegisterStyle.innerContainer}`}>
        <div
          className={`${LoginRegisterStyle.user} ${LoginRegisterStyle.userSignUp} `}
        >
          <div
            className={`${LoginRegisterStyle.signup_image} ${
              active === "SignUp" ? LoginRegisterStyle.active : ""
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1527769929977-c341ee9f2033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              alt="Login"
            />
          </div>
          <div
            className={`${LoginRegisterStyle.formBox} ${
              active === "SignUp" ? LoginRegisterStyle.active : ""
            }`}
          >
            <form onSubmit={createUser}>
              <h2> SIGN UP</h2>
              <input
                type="text"
                className={
                  "form-control mt-3 error " +
                  (registerError.name ? "is-invalid text-danger" : "")
                }
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter Name"
                name="name"
                onChange={(e) => handleChange(e, "register")}
                onBlur={(e) => handleBlur(e, "register")}
                value={registerUser.name}
              />
              <small className="text-danger"> {registerError.name}</small>
              <input
                type="email"
                className={
                  "form-control mt-3 error " +
                  (registerError.email ? "is-invalid text-danger" : "")
                }
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                name="email"
                value={registerUser.email}
                onBlur={(e) => handleBlur(e, "register")}
                onChange={(e) => handleChange(e, "register")}
              />
              <small className="text-danger"> {registerError.email}</small>
              <input
                type="password"
                className={
                  "form-control mt-3 error " +
                  (registerError.password ? "is-invalid text-danger" : "")
                }
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter password"
                onBlur={(e) => handleBlur(e, "register")}
                onChange={(e) => handleChange(e, "register")}
                value={registerUser.password}
                name="password"
              />
              <small className="text-danger"> {registerError.password}</small>
              <input
                type="password"
                className={
                  "form-control mt-3 error " +
                  (registerError.confirmPassword
                    ? "is-invalid text-danger"
                    : "")
                }
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Confirm password"
                onBlur={(e) => handleBlur(e, "register")}
                onChange={(e) => handleChange(e, "register")}
                value={registerUser.confirmPassword}
                name="confirmPassword"
              />
              <p className={"text-danger mb-3 " + LoginRegisterStyle.smallText}>
                {" "}
                {registerError.confirmPassword}
              </p>
              <button type="submit" className="btn btn-dark my-2">
                Sign Up
              </button>
              <p class={LoginRegisterStyle.goToSignupBtn}>
                Already have an account?
                <span className="ms-2" to="#" onClick={() => Signin()}>
                  Sign In.
                </span>
              </p>
            </form>
          </div>
        </div>
        {/* SignIn */}
        <div
          className={`${LoginRegisterStyle.user} ${LoginRegisterStyle.userSignIn} `}
        >
          <div
            className={`${LoginRegisterStyle.formBox} ${
              active === "SignIn" ? LoginRegisterStyle.active : ""
            }`}
          >
            <form onSubmit={handleUserLogin}>
              <h2> SIGN IN</h2>
              <input
                type="email"
                className={"form-control mt-3 error "+ (loginError.email?"is-invalid":"")}
                id="exampleInputEmail2"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                name="email"
                onBlur={(e) => handleBlur(e, "login")}
                value={loginUser.email}
                onChange={(e)=>handleChange(e,'login')}
              />
              <small className="text-danger"> {loginError.email}</small>
              <input
                type="password"
                className={"form-control mt-3 error "}
                id="exampleInputEmail3"
                aria-describedby="emailHelp"
                placeholder="Enter password"
                name="password"
               onBlur={(e) => handleBlur(e, "login")}
                value={loginUser.password}
                onChange={(e)=>handleChange(e,'login')}
              />
              <button type="submit" className="btn btn-dark my-2">
                Sign In
              </button>
              <p class={LoginRegisterStyle.goToSignupBtn}>
                Don't have an account?
                <span className="ms-1" to="#" onClick={() => Signup()}>
                  Sign up.
                </span>
              </p>
            </form>
          </div>
          <div
            className={`${LoginRegisterStyle.signin_image} ${
              active === "SignIn" ? LoginRegisterStyle.active : ""
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1527769929977-c341ee9f2033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              alt="Login"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
