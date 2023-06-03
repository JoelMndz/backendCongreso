import mongoose,{Types} from "mongoose"
import qrcode from 'qrcode'

import { METHOD_PAYMENT, ROLES, STATUS_REGISTER } from "../constants"
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

interface IRegisterAdmin{
  name: string,
  lastname: string,
  email: string,
  phone: string,
  cedula: string,
  address: string,
  company: string,
  password: string
}

interface IRequestLogin{
  email: string,
  password: string,
}

interface IUpdateStatusRegister{
  status: string,
  registerId: string
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

      let voucherURL = null
      if(entity.typePayment === METHOD_PAYMENT.TRANSFER && entity.voucherBase64) voucherURL = await uploadCloudinary(entity.voucherBase64);
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
  },

  async getAllRegisters(status:string){
    let match:any = {}
    if(status) match.status = status;

    return await RegisterModel.find(match).populate('userId').populate('inscriptions.courseId')
  },

  async updateStatusRegister(entity:IUpdateStatusRegister){
    const {error} = UserValidation.validateUpdateStatusRegister.validate(entity);
    if(error) throw new Error(error.message);
    let updateRegister = await RegisterModel.findById(entity.registerId);
    if(!updateRegister) throw new Error('El registroId no es inválido');
    updateRegister.status = entity.status;
    if(updateRegister.status === STATUS_REGISTER.PAID){
      const qr = await qrcode.toDataURL(updateRegister.userId?.toString()!)
      updateRegister.qr = qr;
    }
    
    return await updateRegister?.save()
  },

  registerAdmin: async(entity:IRegisterAdmin)=>{    
    const {error} = UserValidation.validateRegisterAdmin.validate(entity)
    if(error) throw new Error(error.message);
    const resultfindUserByEmail = await UserModel.findOne({email:entity.email.toLocaleLowerCase()});
    if(resultfindUserByEmail) throw new Error('El email ya se encuentra registrado');

    const existsAdmin = await UserModel.findOne({role: ROLES.ADMINISTRATOR});
    if(existsAdmin) throw new Error('Ya existe un administrador registrado');

    entity.password = await encryptText(entity.password)
    
    return await UserModel.create({
      name: entity.name.toLocaleLowerCase(),
      lastname: entity.lastname.toLocaleLowerCase(),
      email: entity.email.toLocaleLowerCase(),
      phone: entity.phone,
      cedula: entity.cedula,
      address: entity.address.toLocaleLowerCase(),
      company: entity.company.toLocaleLowerCase(),
      password: entity.password,
      role: ROLES.ADMINISTRATOR,
    })
  },
}