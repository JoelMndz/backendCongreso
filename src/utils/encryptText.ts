import { genSalt, hash } from 'bcrypt'

export const encryptText = async(text:string)=>{
  const salt = await genSalt(10);
  return await hash(text,salt);
}