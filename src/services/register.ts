import {RegisterModel, CourseModel} from '../models'
import {uploadCloudinary} from '../utils'

interface ICreateRegister{
    typePayment:string,
    inscriptions: string[],
    userId: string,
    voucherBase64: string
}

export const RegisterService = {
    createRegister: async(entity:ICreateRegister)=>{
        let total = 0;
        const inscriptions = entity.inscriptions.map(async(courseId) => {
            const course = await CourseModel.findById(courseId);
            if(!course){
                throw new Error(`El id ${courseId} no le pertenece a ningún curso`)
            }
            total += course.price!
            return{
                courseId
            }
        })
        const voucherURL = await uploadCloudinary(entity.voucherBase64);
        const newRegister = await RegisterModel.create({
            typePayment: entity.typePayment,
            userId: entity.userId,
            voucherURL:voucherURL,
            inscriptions,
            total
        }) 
        return newRegister;
    }
}