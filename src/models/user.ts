import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt'
import { ROLES, TYPE_PRICE_CONGRESS } from '../constants';

const userSchema = new Schema({
  name: String,
  lastname: String,
  email: String,
  participantType:{
    type: String,
    enum: [
      TYPE_PRICE_CONGRESS.medico_general, 
      TYPE_PRICE_CONGRESS.medico_rural, 
      TYPE_PRICE_CONGRESS.medico_especialista,
      TYPE_PRICE_CONGRESS.estudiante,
      TYPE_PRICE_CONGRESS.profesional_salud,
      TYPE_PRICE_CONGRESS.ponencia_congreso_memorias,
      null
    ],
    default: null
  },
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