import Joi from 'joi';
import { joiMessages } from './joiMessage';

export const UserValidation = {
  validateCreateParticipant: Joi.object({
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
    inscriptions: Joi.array().items(Joi.string()).required(),
    typePayment: Joi.string().valid(...['paid','pending','reject']).required(),
    voucherBase64: Joi.string()
      .custom((value, helpers)=>{
        if(!new RegExp(/^data:([a-z]+\/[a-z]+);base64,([a-zA-Z0-9+/]+={0,2})$/).test(value)){
          return helpers.error('string.custom.validarBase64');
        }
        return value;
      }).required(),
  })
  .messages(joiMessages)
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