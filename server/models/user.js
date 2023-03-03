import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  ip:{
    type:String,
    required:false
  }
});
export const user = mongoose.model('user',userSchema,'user-list')