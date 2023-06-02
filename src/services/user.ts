import { UserModel } from "../models"
import { encryptText } from "../utils"
import { UserValidation } from "../validations"
import { RegisterService } from "./register"


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

export const UserService = {
  registerParticipant: async(entity:IRegisterParticipant)=>{    
    const {error} = UserValidation.validateCreateParticipant.validate(entity)
    if(error){
      throw new Error(error.message);
    }
    const resultfindUserByEmail = await UserModel.findOne({email:entity.email.toLocaleLowerCase()});
    if(resultfindUserByEmail){
      throw new Error('El email ya se encuentra registrado');
    }
    entity.password = await encryptText(entity.password)

    const newUser = await UserModel.create({
      name: entity.name.toLocaleLowerCase(),
      lastname: entity.lastname.toLocaleLowerCase(),
      email: entity.email.toLocaleLowerCase(),
      phone: entity.phone,
      cedula: entity.cedula,
      address: entity.address.toLocaleLowerCase(),
      company: entity.company.toLocaleLowerCase(),
      password: entity.password
    })

    await RegisterService.createRegister({
      userId: newUser._id.toString(), 
      inscriptions:entity.inscriptions, 
      typePayment:entity.typePayment, 
      voucherBase64:entity.voucherBase64
    })
    
    return newUser;
  }
}