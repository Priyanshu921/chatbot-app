import express from "express";
import { registerUser, userLogin, userLogout } from "../controller/user.controller";
const userRoutes = express();
userRoutes.post("/register", registerUser);
userRoutes.post("/login", userLogin);
userRoutes.post("/logout", userLogout);
export default userRoutes;
