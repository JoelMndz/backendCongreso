import {RegisterModel, CourseModel} from '../models'
import {uploadCloudinary} from '../utils'

import {Types} from 'mongoose'

interface ICreateRegister{
    typePayment:string,
    inscriptions: string[],
    userId: string,
    voucherBase64: string
}

export const RegisterService = {
    createRegister: async(entity:ICreateRegister)=>{
        const voucherURL = await uploadCloudinary(entity.voucherBase64);
        const newRegister = new RegisterModel({
            typePayment: entity.typePayment,
            userId: entity.userId,
            voucherURL:voucherURL,
        })
        let total = 0;
        for (let i = 0; i < entity.inscriptions.length; i++) {
            let courseId = entity.inscriptions[i];
            const course = await CourseModel.findById(courseId);
            if(!course){
                throw new Error(`El id ${courseId} no le pertenece a ningún curso`)
            }
              
            newRegister.inscriptions.push({
                attendanceDate: null!,
                certificateURL: null!,
                courseId: new Types.ObjectId(courseId)
            })
            total += course.price!
        }
        newRegister.total = total;
        await newRegister.save();
        return newRegister;
    }
}