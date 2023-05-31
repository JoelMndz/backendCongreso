import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt'
import { ROLES } from '../constants';

const userSchema = new Schema({
  name: String,
  lastname: String,
  email: String,
  phone: String,
  cedula: String,
  address: String,
  company: String,
  password: String,
  role:{
    type: String,
    enum: [ROLES.PARTICIPANT, ROLES.ADMINISTRATOR, ROLES.VERIFIER]
  }
});

userSchema.methods.comparePasswords = async function(password:string){
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const UserModel = model('users', userSchema);