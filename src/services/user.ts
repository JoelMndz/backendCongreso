import { Types } from "mongoose";
import qrcode from "qrcode";
import moment, { Moment } from "moment";

import {
  METHOD_PAYMENT,
  ROLES,
  STATUS_REGISTER,
  TYPE_COURSE,
  TYPE_PRICE_CONGRESS,
} from "../constants";
import {
  encryptText,
  generateToken,
  uploadCloudinary,
  enviarEmail,
  generatePassword,
  generateRandomCode,
  enviarEmailConArchivo,
} from "../utils";
import { UserValidation } from "../validations";
import { RegisterModel, CourseModel, UserModel } from "../models";

interface IRegisterParticipant {
  name: string;
  lastname: string;
  email: string;
  participantType: string;
  phone: string;
  cedula: string;
  address: string;
  company: string;
  password: string;
  inscriptions: string[];
  typePayment: string;
  voucherBase64: string;
}

interface IRegisterJSON{
  name: string;
  lastname: string;
  email: string;
  participantType: string;
  phone: string;
  cedula: string;
  address: string;
  company: string;
  inscriptions: string;
  status: string;
}

interface IRegisterAdmin {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  cedula: string;
  address: string;
  company: string;
  password: string;
  role: string;
}

interface IRequestLogin {
  email: string;
  password: string;
}

interface IUpdateStatusRegister {
  status: string;
  registerId: string;
}

interface IcheckAttendance {
  // courseId: string;
  // userId: string;
  registerId: string;
  inscriptionId:string
}

interface ICheckAttendanceIdentity {
  cedula: string;
  courseId: string;
}

interface IUpdateUser {
  name: string;
  lastname: string;
  email: string;
  address: string;
  company: string;
  phone: string;
  cedula: string;
}

interface ICodeResetPassword {
  email: string;
}

interface IResetPassword {
  email: string;
  codeChangePassword: Number;
  newPassword: string;
}

export const UserService = {
  registerParticipant: async (entity: IRegisterParticipant) => {
    const { error } = UserValidation.validateCreateParticipant.validate(entity);
    if (error) throw new Error(error.message);
    const resultfindUserByEmail = await UserModel.findOne({
      email: entity.email.toLocaleLowerCase(),
    });
    if (resultfindUserByEmail)
      throw new Error("El email ya se encuentra registrado");
    entity.password = await encryptText(entity.password);

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
      participantType: entity.participantType,
    });

    let total = 0;
    const inscriptions: any[] = [];
    for (let i = 0; i < entity.inscriptions.length; i++) {
      const course = await CourseModel.findById(entity.inscriptions[i]);
      if (!course)
        throw new Error(
          `El id ${entity.inscriptions[i]} no le pertenece a ningún curso`
        );
      if (course.type === TYPE_COURSE.CONGRESS) {
        switch (entity.participantType) {
          case TYPE_PRICE_CONGRESS.estudiante: {
            total += course.congressPrice!["estudiante"]!;
            break;
          }
          case TYPE_PRICE_CONGRESS.medico_general: {
            total += course.congressPrice!["medico_general"]!;
            break;
          }
          case TYPE_PRICE_CONGRESS.medico_rural: {
            total += course.congressPrice!["medico_rural"]!;
            break;
          }
          case TYPE_PRICE_CONGRESS.medico_especialista: {
            total += course.congressPrice!["medico_especialista"]!;
            break;
          }
          case TYPE_PRICE_CONGRESS.profesional_salud: {
            total += course.congressPrice!["profesional_salud"]!;
            break;
          }
          case TYPE_PRICE_CONGRESS.ponencia_congreso_memorias: {
            total += course.congressPrice!["ponencia_congreso_memorias"]!;
            break;
          }
        }
      } else {
        total += course.price!;
      }
      inscriptions.push({
        courseId: new Types.ObjectId(entity.inscriptions[i]),
      });
    }

    let voucherURL = null;
    if (entity.typePayment === METHOD_PAYMENT.TRANSFER && entity.voucherBase64)
      voucherURL = await uploadCloudinary(entity.voucherBase64);
    const newRegister = new RegisterModel({
      typePayment: entity.typePayment,
      userId: newUser._id,
      voucherURL: voucherURL,
      total,
      inscriptions,
    });

    await newUser.save();
    await newRegister.save();

    return newUser;
  },

  async login(entity: IRequestLogin) {
    const { error } = UserValidation.validateLogin.validate(entity);
    if (error) throw new Error(error.message);

    const user: any = await UserModel.findOne({
      email: entity.email.toLocaleLowerCase(),
    });
    if (!user) throw new Error("Credenciales incorrectas");
    const passwordMatch: boolean = await user.comparePasswords(entity.password);
    if (!passwordMatch) throw new Error("Credenciales incorrectas");

    const token = generateToken(user._id);

    return { user, token };
  },

  async findById(id: string) {
    return await UserModel.findById(id);
  },

  async getAllRegisters(status: string) {
    let match: any = {};
    if (status) match.status = status;

    return await RegisterModel.find(match)
      .populate("userId")
      .populate("inscriptions.courseId");
  },

  async updateStatusRegister(entity: IUpdateStatusRegister) {
    const { error } =
      UserValidation.validateUpdateStatusRegister.validate(entity);
    if (error) throw new Error(error.message);
    let updateRegister:any = await RegisterModel.findById(entity.registerId).populate('userId');
    if (!updateRegister) throw new Error("El registroId no es inválido");
    updateRegister.status = entity.status;
    if (updateRegister.status === STATUS_REGISTER.PAID) {
      const qr = await qrcode.toDataURL(updateRegister._id?.toString()!);
      updateRegister.qr = qr;
      const emailSubject = "QR Congreso";
      const emailMessage =
        `<h6>Estr QR le sirve para marcar su asistencia en el congreso</h6><br><img src="${qr}" alt="qr">`;
    
      if (updateRegister?.userId?.email as string) {
        await enviarEmail(updateRegister?.userId?.email, emailMessage, emailSubject);
      }
    }

    return await updateRegister?.save();
  },

  registerAdmin: async (entity: IRegisterAdmin) => {
    const { error } = UserValidation.validateRegisterAdmin.validate(entity);
    if (error) throw new Error(error.message);
    const resultfindUserByEmail = await UserModel.findOne({
      email: entity.email.toLocaleLowerCase(),
    });
    if (resultfindUserByEmail)
      throw new Error("El email ya se encuentra registrado");

    const existsAdmin = await UserModel.findOne({ role: ROLES.ADMINISTRATOR });
    if (existsAdmin) throw new Error("Ya existe un administrador registrado");

    entity.password = await encryptText(entity.password);

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
    });
  },

  registerVerifier: async (entity: IRegisterAdmin) => {
    const { error } = UserValidation.validateRegisterVerifier.validate(entity);
    if (error) throw new Error(error.message);

    const resultfindUserByEmail = await UserModel.findOne({
      email: entity.email.toLocaleLowerCase(),
    });
    if (resultfindUserByEmail)
      throw new Error("El email ya se encuentra registrado");

    entity.password = generatePassword();

    const encryptedPassword = await encryptText(entity.password);

    const address = entity.address ? entity.address.toLocaleLowerCase() : null;

    const newAdmin = await UserModel.create({
      name: entity.name.toLocaleLowerCase(),
      lastname: entity.lastname.toLocaleLowerCase(),
      email: entity.email.toLocaleLowerCase(),
      phone: entity.phone,
      cedula: entity.cedula,
      address: address,
      company: entity.company.toLocaleLowerCase(),
      password: encryptedPassword,
      role: ROLES.VERIFIER,
    });

    const emailMessage = "Bienvenido nuevo verificador!";
    const emailSubject = `Hola ${newAdmin.name},
  
    Se ha creado una cuenta de administrador para ti en nuestra aplicación.
    A continuación, se muestra tu contraseña de inicio de sesión:
    Contraseña: <b>${entity.password}</b>
    
    Puedes acceder a la aplicación utilizando tu dirección de correo electrónico y la contraseña proporcionada.
    
    Saludos,
    El equipo de administración`;

    if (newAdmin.email) {
      await enviarEmail(newAdmin.email, emailSubject, emailMessage);
    } else {
      throw new Error(
        "No se pudo enviar el correo electrónico al nuevo administrador"
      );
    }
    return newAdmin;
  },

  checkAttendance: async (entity: IcheckAttendance) => {
    const existeRegistro = await RegisterModel.findOne({
      _id: entity.registerId     
    });
    if (existeRegistro && existeRegistro?.status == "paid") {
      const inscription = existeRegistro.inscriptions.find((x:any) => x._id.toString() === entity.inscriptionId)
      
      if(inscription){
        const courseId = inscription.courseId;
        const course = await CourseModel.findOne({ _id: courseId });
        const now = Date.now();
        const fechabusqueda: Moment = moment(now);
        fechabusqueda.startOf("day");
        const fechaDate: Date = fechabusqueda.toDate();
        const fechaExistente = inscription.attendanceDate.find(x => moment(x).format('DD/MM/YYYY') === moment(fechaDate).format('DD/MM/YYYY'))
  
        if (course?.startDate && course?.endDate) {
          if (
            moment(fechaDate).isSameOrAfter(course.startDate) &&
            moment(fechaDate).isSameOrBefore(course.endDate)
          ) {
            if (!fechaExistente) {
              return await RegisterModel.findOneAndUpdate(
                {
                  _id: entity.registerId,
                  "inscriptions._id": entity.inscriptionId,
                },
                { $push: { "inscriptions.$.attendanceDate": fechaDate } },
                { new: true }
              );
            } else {
              throw new Error("!Ya se encuentra registrada la asistencia!");
            }
          } else {
            throw new Error(
              `Inicio :${moment(course.startDate).format('DD/MM/YYYY')} - Fin: ${moment(course.endDate).format('DD/MM/YYYY')} del curso, no se pueden registrar asistencias`
            );
          }
        } else {
          throw new Error("Ha ocurrido un error");
        }
      } else {
        throw new Error("!La inscripcion  no fue encontrado!");
      }
    }else {
      throw new Error("!El registro no fue encontrado!");
    }
    
  },

  checkAttendanceIdentity: async (entity: ICheckAttendanceIdentity) => {
    const usuario = await UserModel.findOne({ cedula: entity.cedula });
    if (!usuario) {
      throw new Error("!El usuario no se encuentra registrado!");
    }
    const userId = usuario._id.toString();
    const existeUsuario = await RegisterModel.findOne({
      userId: userId,
      "inscriptions.courseId": entity.courseId,
    });
    const course = await CourseModel.findOne({ _id: entity.courseId });
    const now = Date.now();
    const fechabusqueda: Moment = moment(now);
    fechabusqueda.startOf("day");
    const fechaDate: Date = fechabusqueda.toDate();

    const fechaExistente = await RegisterModel.findOne({
      userId: userId,
      "inscriptions.courseId": entity.courseId,
      "inscriptions.attendanceDate": fechaDate,
    });

    if (existeUsuario && existeUsuario.status == "paid") {
      if (course?.startDate && course?.endDate) {
        if (
          moment(fechaDate).isSameOrAfter(course.startDate) &&
          moment(fechaDate).isSameOrBefore(course.endDate)
        ) {
          if (!fechaExistente) {
            return await RegisterModel.findOneAndUpdate(
              { userId: userId, "inscriptions.courseId": entity.courseId },
              { $push: { "inscriptions.$.attendanceDate": fechaDate } },
              { new: true }
            );
          } else {
            throw new Error("Ya se encuntra registrada la asistencia!");
          }
        } else {
          throw new Error(
            `Inicio :${course?.startDate} - Fin: ${course?.endDate} del curso, ya no se pueden registrar asistencias`
          );
        }
      } else {
        throw new Error("Ha ocurrido un error");
      }
    } else {
      throw new Error("El usuario no se encuentra registrado en el curso!");
    }
  },

  async getAllRegistersByParticipant(participantId: string) {
    return await RegisterModel.find({ userId: participantId })
      .populate("userId")
      .populate("inscriptions.courseId");
  },

  async updatetUser(id_user: string, entity: IUpdateUser) {
    const { error } = UserValidation.validateEditUser.validate(entity);
    if (error) throw new Error(error.message);

    const usuario = UserModel.findById({ _id: id_user });
    if (!usuario) throw new Error("Ocurrio un problema");
    return await UserModel.findOneAndUpdate(
      {
        _id: id_user,
      },
      {
        $set: {
          name: entity.name,
          lastname: entity.lastname,
              email:entity.email,
          address: entity.address,
          company: entity.company,
          phone: entity.phone,
          cedula: entity.cedula,
        },
      },
      { new: true }
    );
  },

  async updateVerifierForAdmin(id_verifier: string, entity: IUpdateUser) {
    const { error } = UserValidation.validateEditUser.validate(entity);
    if (error) throw new Error(error.message);

    const usuario = UserModel.findById({ _id: id_verifier });
    if (!usuario) throw new Error("Ha ocurrio un problema");
    return await UserModel.findOneAndUpdate(
      {
        _id: id_verifier,
      },
      {
        $set: {
          name: entity.name,
          lastname: entity.lastname,
              email:entity.email,
          address: entity.address,
          company: entity.company,
          phone: entity.phone,
          cedula: entity.cedula,
        },
      },
      { new: true }
    );
  },

  async getRegisterById(id: string) {
    const register =  await RegisterModel.findById(id)
      .populate("userId")
      .populate("inscriptions.courseId");
    if(register)
      return register
    throw new Error("El id del registro no existe!")
  },

  sendCodeChangePassword: async (entity: ICodeResetPassword) => {
    const user = await UserModel.findOne({
      email: entity.email.toLocaleLowerCase(),
    });
    if (!user) throw new Error("El correo electrónico no está registrado");
  
    const code = generateRandomCode();
  
    user.codeChangePassword = code;
    await user.save();
  
    const emailMessage = "Código de cambio de contraseña";
    const emailSubject =
      `Hola ${user.name},\n\n` +
      `Aquí está tu código de cambio de contraseña:\n\n` +
      `<b>${code}</b>\n\n` +
      `Utiliza este código para cambiar tu contraseña en nuestra aplicación.\n\n` +
      `Saludos,\n` +
      `El equipo de soporte`;

  
    if (user.email) {
      await enviarEmail(user.email, emailSubject, emailMessage);
    }
  },
  
  resetPassword: async (entity: IResetPassword) => {
    const { email, codeChangePassword, newPassword } = entity;

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error("El correo electrónico no está registrado");
    }

    if (user.codeChangePassword !== codeChangePassword) {
      throw new Error("El código de cambio de contraseña no es válido");
    }
    
     // Validación de la nueva contraseña
    const specialChars = "!@#$%^&*()_+~`|}{[]\\:;?><,./-=";
    
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !RegExp(
        `[${specialChars.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}]`
      ).test(newPassword)
    ) {
      throw new Error("La nueva contraseña no cumple con los requisitos");
    }

    const encryptedPassword = await encryptText(entity.newPassword);

    user.password = encryptedPassword;
    user.codeChangePassword = undefined;
    await user.save();
  },

  getAllUsers:async ()=>{
    return await UserModel.find();
  },

  registerParticipantsJSON: async(data:IRegisterJSON[])=>{
    const reject:any[] = [];
    const succesfull:any[] = [];
    const courses = await CourseModel.find();

    for (let i = 0; i < data.length; i++) {
      try {
        let entity = data[i];
        const resultfindUserByEmail = await UserModel.findOne({
          email: entity.email.toLocaleLowerCase(),
        });     
        if (resultfindUserByEmail)
          throw new Error("El email ya se encuentra registrado");
        
        if (resultfindUserByEmail)
          throw new Error("El email ya se encuentra registrado");
        const password = await encryptText("Cont2023001@");
    
        const newUser = new UserModel({
          name: entity.name.toLocaleLowerCase(),
          lastname: entity.lastname.toLocaleLowerCase(),
          email: entity.email.toLocaleLowerCase(),
          phone: entity.phone,
          cedula: entity.cedula,
          address: entity.address.toLocaleLowerCase(),
          company: entity.company.toLocaleLowerCase(),
          password: password,
          role: ROLES.PARTICIPANT,
          participantType: entity.participantType.toLocaleLowerCase(),
        });
        let total = 0;
        const inscriptions: any[] = [];
        const namesInscriptions:string[] = entity.inscriptions.split(',');
        
        for (let i = 0; i < namesInscriptions.length; i++) {
          const course = courses.find(x => x.title === namesInscriptions[i].trim())
          if (course){
            if (course.type === TYPE_COURSE.CONGRESS) {
              switch (entity.participantType.toLocaleLowerCase()) {
                case TYPE_PRICE_CONGRESS.estudiante: {
                  total += course.congressPrice!["estudiante"]!;
                  break;
                }
                case TYPE_PRICE_CONGRESS.medico_general: {
                  total += course.congressPrice!["medico_general"]!;
                  break;
                }
                case TYPE_PRICE_CONGRESS.medico_rural: {
                  total += course.congressPrice!["medico_rural"]!;
                  break;
                }
                case TYPE_PRICE_CONGRESS.medico_especialista: {
                  total += course.congressPrice!["medico_especialista"]!;
                  break;
                }
                case TYPE_PRICE_CONGRESS.profesional_salud: {
                  total += course.congressPrice!["profesional_salud"]!;
                  break;
                }
                case TYPE_PRICE_CONGRESS.ponencia_congreso_memorias: {
                  total += course.congressPrice!["ponencia_congreso_memorias"]!;
                  break;
                }
              }
            } else {
              total += course.price!;
            }
            inscriptions.push({
              courseId: new Types.ObjectId(course._id),
            });

          }
          
        }

        const newRegister = new RegisterModel({
          typePayment: METHOD_PAYMENT.EFECTIVE,
          userId: newUser._id,
          voucherURL: null,
          total,
          inscriptions,
          status: STATUS_REGISTER.PAID
        });
    
        newRegister.qr = await qrcode.toDataURL(newRegister._id?.toString()!);
        const emailSubject = "QR Congreso 2023";
        const emailMessage =
          `<h1>Ingnorar el QR anterior.</h1>
          <h2>Contraseña: <strong>Cont2023001@</strong></h2>
          <h2>Este QR le sirve para marcar su asistencia en el congreso</h2><br><img src="${newRegister.qr}" alt="qr">`;
      
        await enviarEmail(newUser?.email as string,emailMessage, emailSubject);
        await newUser.save();
        await newRegister.save();
        
        succesfull.push(newUser);
      } catch (error:any) {
        reject.push({error:error.message ?? 'Ocurrio un error', user: data[i]})
      }
    }
    

    return {reject, succesfull}
  },

  sendEmailMasive: async (entity:{message:string, subject:string, files:any[]})=>{
    const users = await UserModel.find()
    for (let i = 0; i < users.length; i++) {
      await enviarEmailConArchivo(users[i].email as string,entity.message, entity.subject, entity.files)
    }
    return users.map(x => x.email)
  }
};
