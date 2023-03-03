import { apiResponse } from "../helper/response";
import { user } from "../models/user";
import bcrypt from "bcrypt";
import { socket } from "../socket";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return apiResponse(res, {
        statusCode: 403,
        global_error: "passwords don't match",
      });
    }
    const userExist = await user.findOne({ email });
    if (userExist) {
      return apiResponse(res, {
        statusCode: 403,
        global_error: "User already exist with same email",
      });
    }
    const saltRounds = 10;
    let hashedPassword = req.body.password;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        return apiResponse(res, {
          statusCode: 500,
          global_error: "problem while generating salt",
        });
      }
      bcrypt.hash(password, salt, async(err, hash)=> {
        if (err) {
          return apiResponse(res, {
            statusCode: 500,
            global_error: "problem while hashing password",
          });
        }
        const userCreated = await user.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role:"Agent",
          online:false,
          available:false
        });
        if(userCreated){
            apiResponse(res, {
              statusCode: 200,
              message: "user created successfully",
            });
        }
      });
    });
  } catch (error) {
    return apiResponse(res, {
      statusCode: 500,
      global_error: "problem while registering user",
    });
  }
};

export const userLogin = async(req,res) => {
    try{
        const {email,password} = req.body;
        const userFound = await user.findOne({email}).lean().exec()
        if(!userFound){
            return apiResponse(req,{statusCode:400,global_error:"invalid email"})
        }
        const updatedUser = await user.updateOne({email:userFound.email},{online:true,available:true})
        const match = await bcrypt.compare(password,userFound.password)
        if(!match){
            return apiResponse(res,{statusCode:400,global_error:"invalid password"})
        }
        return apiResponse(res,{statusCode:200,data:{...userFound,password:null},message:"login successfull"})
    }
    catch(error){
        return apiResponse(res,{global_error:"Problem while logging in",statusCode:500})
    }
}

export const userLogout = async (req,res) => {
  try{
        const io = socket.getIo();
    const {email} = req.body;
    const updateUser = await user.updateOne({email},{online:false,available:false})
    if(!updateUser.modifiedCount){
        return apiResponse(res,{statusCode:400,global_error:"invalid user"})
    }
    io.emit(`${email}`, {
      message:"agent logged out"
    });
    return apiResponse(res,{statusCode:200,message:"logout successfull"})
  }
  catch(error){

        return apiResponse(res,{global_error:"Problem while logging out",statusCode:500})
    }
}

