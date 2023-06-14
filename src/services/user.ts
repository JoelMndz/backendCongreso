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
  courseId: string;
  userId: string;
}

interface ICheckAttendanceIdentity {
  cedula: string;
  courseId: string;
}

interface ICodeResetPassword {
  email: string;
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
    let updateRegister = await RegisterModel.findById(entity.registerId);
    if (!updateRegister) throw new Error("El registroId no es inválido");
    updateRegister.status = entity.status;
    if (updateRegister.status === STATUS_REGISTER.PAID) {
      const qr = await qrcode.toDataURL(updateRegister.userId?.toString()!);
      updateRegister.qr = qr;
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

    const emailSubject = "Registro exitoso como administrador";
    const emailMessage = `Hola ${newAdmin.name},
  
    Se ha creado una cuenta de administrador para ti en nuestra aplicación.
    A continuación, se muestra tu contraseña de inicio de sesión:
    Contraseña: ${entity.password}
    
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
    const existeUsuario = await RegisterModel.findOne({
      userId: entity.userId,
      "inscriptions.courseId": entity.courseId,
    });
    const course = await CourseModel.findOne({ _id: entity.courseId });
    const now = Date.now();
    const fechabusqueda: Moment = moment(now);
    fechabusqueda.startOf("day");
    const fechaDate: Date = fechabusqueda.toDate();
    const fechaExistente = await RegisterModel.findOne({
      userId: entity.userId,
      "inscriptions.courseId": entity.courseId,
      "inscriptions.attendanceDate": fechaDate,
    });

    if (existeUsuario && existeUsuario?.status == "paid") {
      if (course?.startDate && course?.endDate) {
        if (
          moment(fechaDate).isSameOrAfter(course.startDate) &&
          moment(fechaDate).isSameOrBefore(course.endDate)
        ) {
          if (!fechaExistente) {
            return await RegisterModel.findOneAndUpdate(
              {
                userId: entity.userId,
                "inscriptions.courseId": entity.courseId,
              },
              { $push: { "inscriptions.$.attendanceDate": fechaDate } },
              { new: true }
            );
          } else {
            throw new Error("!Ya se encuntra registrada la asistencia!");
          }
        } else {
          throw new Error(
            `Inicio :${course.startDate} - Fin: ${course.endDate} del curso, no se pueden registrar asistencias`
          );
        }
      } else {
        throw new Error("Ha ocurrido un error");
      }
    } else {
      throw new Error("!El usuario no se encuentra registrado en el curso!");
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

  sendCodeChangePassword : async (entity: ICodeResetPassword) => {
    const user = await UserModel.findOne({ email: entity.email.toLocaleLowerCase(), });
    if (!user) throw new Error("El correo electrónico no está registrado");
  
    const code = generateRandomCode();
  
    user.codeChangePassword = code;
    await user.save();
  
    const emailSubject = "Código de cambio de contraseña";
    const emailMessage =
      `Hola ${user.name},\n\n` +
      `Aquí está tu código de cambio de contraseña: ${code}\n\n` +
      `Utiliza este código para cambiar tu contraseña en nuestra aplicación.\n\n` +
      `Saludos,\n` +
      `El equipo de soporte`;
  
    if (user.email) {
      await enviarEmail(user.email, emailSubject, emailMessage);
    }
  },
};
