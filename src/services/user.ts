import mongoose,{Types} from "mongoose"

import { ROLES } from "../constants"
import { encryptText, generateToken,uploadCloudinary } from "../utils"
import { UserValidation } from "../validations"
import {RegisterModel, CourseModel, UserModel} from '../models'


interface IRegisterParticipant{
  name: string,
  lastname: string,
  email: string,
  phone: string,
  cedula: string,
  address: string,
  company: string,
  password: string,
  inscriptions: string[],
  typePayment: string,
  voucherBase64: string
}

interface IRequestLogin{
  email: string,
  password: string,
}

export const UserService = {
  registerParticipant: async(entity:IRegisterParticipant)=>{    
    const {error} = UserValidation.validateCreateParticipant.validate(entity)
    if(error) throw new Error(error.message);
    const resultfindUserByEmail = await UserModel.findOne({email:entity.email.toLocaleLowerCase()});
    if(resultfindUserByEmail) throw new Error('El email ya se encuentra registrado');
    entity.password = await encryptText(entity.password)
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newUser = new UserModel({
        name: entity.name.toLocaleLowerCase(),
        lastname: entity.lastname.toLocaleLowerCase(),
        email: entity.email.toLocaleLowerCase(),
        phone: entity.phone,
        cedula: entity.cedula,
        address: entity.address.toLocaleLowerCase(),
        company: entity.company.toLocaleLowerCase(),
        password: entity.password,
        role: ROLES.PARTICIPANT,
      })

      await newUser.save({session})

      let total = 0;
      const inscriptions:any[] = []
      for (let i = 0; i < entity.inscriptions.length; i++) {
        const course = await CourseModel.findById(entity.inscriptions[i]);
        if(!course) throw new Error(`El id ${entity.inscriptions[i]} no le pertenece a ningún curso`);
        total += course.price!
        inscriptions.push({ courseId: new Types.ObjectId(entity.inscriptions[i]) })
      }

      const voucherURL = await uploadCloudinary(entity.voucherBase64);
      const newRegister = new RegisterModel({
        typePayment: entity.typePayment,
        userId: newUser._id,
        voucherURL:voucherURL,
        total,
        inscriptions,
      })
      await newRegister.save({session});
      
      await session.commitTransaction();
      session.endSession();
      return newUser;
    } catch (error:any) {
      await session.abortTransaction();
      session.endSession();
      throw error
    }
  },

  async login(entity:IRequestLogin){
    
    const {error} = UserValidation.validateLogin.validate(entity);
    if(error) throw new Error(error.message);

    const user:any = await UserModel.findOne({email: entity.email.toLocaleLowerCase()});
    if(!user) throw new Error('Credenciales incorrectas');
    const passwordMatch:boolean = await user.comparePasswords(entity.password);
    if (!passwordMatch) throw new Error('Credenciales incorrectas');

    const token = generateToken(user._id)

    return {user, token};
  },

  async findById(id:string){
    return await UserModel.findById(id);
  }
}