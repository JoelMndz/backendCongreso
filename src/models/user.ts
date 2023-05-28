import {Schema, model} from 'mongoose';

const userSchema = new Schema({
  name: String,
  lastname: String,
  email: String,
  phone: String,
  cedula: String,
  adress: String,
  company: String,
  password: String,
  role:{
    type: String,
    enum: ['participant','administrator','verifier']
  }
});

export const UserModel = model('users', userSchema);