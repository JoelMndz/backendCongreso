import Joi from 'joi';
import { joiMessages } from './joiMessage';
import { Types } from 'mongoose';
import { METHOD_PAYMENT, STATUS_REGISTER } from '../constants';

export const UserValidation = {
  validateCreateParticipant: Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    participantType: Joi.string().required(),
    phone: Joi.string().required(),
    cedula: Joi.string()
      .required(),
    address: Joi.string(),
    company: Joi.string(),
    password: Joi.string().min(8).required(),
    inscriptions: Joi.array().min(1).items(Joi.string().custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error('objectId.invalid');
      }
      return value;
    }))
      .required(),
    typePayment: Joi.string().valid(...['transfer','efective']).required(),
    voucherBase64: Joi.when('typePayment',{
      is: METHOD_PAYMENT.TRANSFER,
      then: Joi.custom((value, helpers)=>{
        if(!new RegExp(/^data:([a-z]+\/[a-z]+);base64,([a-zA-Z0-9+/]+={0,2})$/).test(value)){
          return helpers.error('string.custom.validateBase64');
        }
        return value;
      }),
      otherwise: Joi.optional()
    }),
  })
  .messages(joiMessages),

  validateLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
  .messages(joiMessages),

  validateUpdateStatusRegister: Joi.object({
    status: Joi.string().valid(...[STATUS_REGISTER.PAID,STATUS_REGISTER.PENDING,STATUS_REGISTER.REJECT]).required(),
    registerId: Joi.string().custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error('objectId.invalid');
      }
      return value;
    }),
  })
  .messages(joiMessages),

  validateRegisterAdmin: Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    cedula: Joi.string()
      .custom((value,helpers)=>{
        if(!validateCedula(value)){
          return helpers.error('string.custom.validateCedula'); 
        }
        return value;
      })
      .required(),
    address: Joi.string(),
    company: Joi.string(),
    password: Joi.string().min(8).required(),
  })
  .messages(joiMessages),

  validateRegisterVerifier: Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    cedula: Joi.string().required(),
    address: Joi.string(),
    company: Joi.string(),
    password: Joi.string().min(8),
    role: Joi.string().required(),
  })
  .messages(joiMessages),
}


const validateCedula = (cedula:string)=>{
  if(!new RegExp(/^\d{10}$/).test(cedula)){
    return false;
  }

  let digits = cedula.split('').map(x => parseInt(x));
  let oddsNumbers = [];
  let pairsNumbers = [];

  for (let i = 0; i < 9; i++) {
    i % 2 == 0 ? 
      oddsNumbers.push( ((digits[i] * 2) > 9) ? (digits[i] * 2) - 9 : digits[i] * 2 ) :
      pairsNumbers.push(digits[i]);
  }

  let sum = 0;
  [...pairsNumbers, ...oddsNumbers].forEach(number => {
    sum += number
  })
  let residue = sum % 10;
  let digitVerify = residue > 0 ? 10 - residue : 0;

  if(digits[9]!== digitVerify){
    return false;
  }
  
  return true;
}