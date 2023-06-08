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

interface IcheckAttendance{
  courseId : string,
  userId: string
}


interface ICheckAttendanceIdentity{
  cedula : string,
  courseId: string
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

  checkAttendance: async(entity:IcheckAttendance)=>{
    const existeUsuario = await RegisterModel.findOne({userId:entity.userId,'inscriptions.courseId':entity.courseId});
    const course = await CourseModel.findOne({_id:entity.courseId});
    const now = Date.now();
    const fecha =new Date(now);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1; 
    const day = fecha.getDate();
    const fechaBusqueda = `${day}-${month}-${year}`;
    //const fechaBusqueda = "9-6-2023";
    const fechaExistente = await RegisterModel.findOne({userId:entity.userId,'inscriptions.courseId':entity.courseId,'inscriptions.attendanceDate':fechaBusqueda});
    
    if (existeUsuario && existeUsuario.status == "paid") {
      if (course?.startDate && fecha >= course.startDate && course?.endDate && fecha <= course.endDate) {
        if (!fechaExistente) {
          return await RegisterModel.findOneAndUpdate({'userId':entity.userId,'inscriptions.courseId':entity.courseId},{$push: {'inscriptions.$.attendanceDate':fechaBusqueda}},{new:true});
        }else{
          throw new Error('!Ya se encuntra registrada la asistencia!');
        }

      } else {
        throw new Error(`Inicio :${course?.startDate} - Fin: ${course?.endDate} del curso, ya no se pueden registrar asistencias`);
      }

    }else{
       throw new Error('!El usuario no se encuentra registrado en el curso!');
    }
  },
  checkAttendanceIdentity: async(entity:ICheckAttendanceIdentity)=>{
    const usuario = await UserModel.findOne({cedula:entity.cedula});
    if(!usuario){
     throw new Error('!El usuario no se encuentra registrado!');
    }
    const userId = usuario._id.toString();
    const existeUsuario = await RegisterModel.findOne({userId:userId,'inscriptions.courseId':entity.courseId});
    const course = await CourseModel.findOne({_id:entity.courseId});
    const now = Date.now();
    const fecha =new Date(now)
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1; 
    const day = fecha.getDate();
    const fechaBusqueda = `${day}-${month}-${year}`;
    //const fechaBusqueda = "9-6-2023";

    const fechaExistente = await RegisterModel.findOne({userId:userId,'inscriptions.courseId':entity.courseId,'inscriptions.attendanceDate':fechaBusqueda});
    if (existeUsuario && existeUsuario.status == "paid" ) {
      if (course?.startDate && fecha >= course.startDate && course?.endDate && fecha <= course.endDate) {
        if (!fechaExistente) {
          return await RegisterModel.findOneAndUpdate({'userId':userId,'inscriptions.courseId':entity.courseId},{$push: {'inscriptions.$.attendanceDate':fechaBusqueda}},{new:true});
        }else{
          throw new Error('Ya se encuntra registrada la asistencia!');
        }
      }else{
        throw new Error(`Inicio :${course?.startDate} - Fin: ${course?.endDate} del curso, ya no se pueden registrar asistencias`);

      }
    }else{
      throw new Error('El usuario no se encuentra registrado en el curso!');
    }
    
  }
}