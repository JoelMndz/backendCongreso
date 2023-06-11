import { CourseModel } from "../models";
import { CourseValidation } from "../validations";
import { uploadCloudinary } from "../utils";
interface ICreateCourse {
  title: string;
  description: string;
  photoBase64: string;
  price: number;
  type: string;
  startDate: Date;
  endDate: Date;
  certificateTemplateBase64: string;
}

export const CourseService = {
  createCourse: async (entity: ICreateCourse) => {
    const { error } = CourseValidation.validateCreateCourse.validate(entity);
    if (error) {
      throw new Error(error.message);
    }
    const photoURL = await uploadCloudinary(entity.photoBase64);
    let certificateTemplateURL = null;
    if (entity.certificateTemplateBase64) {
      certificateTemplateURL = await uploadCloudinary(
        entity.certificateTemplateBase64
      );
    }

    if (entity.type === "congress") {
      return await CourseModel.create({
        title: entity.title,
        description: entity.description ?? null,
        photoURL: photoURL,
        congressPrice: {
          medico_especialista: 150,
          medico_general: 100,
          medico_rural: 100,
          profesional_salud: 100,
          estudiante: 50,
          ponencia_congreso_memorias: 150,
        },
        type: entity.type,
        startDate: entity.startDate,
        endDate: entity.endDate,
        certificateTemplateURL: certificateTemplateURL,
      });
    }

    return await CourseModel.create({
      title: entity.title,
      description: entity.description,
      photoURL: photoURL,
      price: entity.price,
      congressPrice: null,
      type: entity.type,
      startDate: entity.startDate,
      endDate: entity.endDate,
      certificateTemplateURL: certificateTemplateURL,
    });
  },

  getAllCourses: async () => {
    const courses = await CourseModel.find();
    return courses;
  },

  getCourseById: async (id: string) => {
    const course = await CourseModel.findById(id);
    return course;
  },

  updateCourse: async (id: string, updates: ICreateCourse) => {
    const { error } = CourseValidation.validateUpdateCourse.validate(updates);
    if (error) {
      throw new Error(error.message);
    }

    let queryUpdate: any = {
      title: updates.title,
      description: updates.description,
      price: updates.price,
      type: updates.type,
      startDate: updates.startDate,
      endDate: updates.endDate,
    };

    if (updates.photoBase64) {
      queryUpdate.photoURL = await uploadCloudinary(updates.photoBase64);
    }

    if (updates.certificateTemplateBase64) {
      queryUpdate.certificateTemplateURL = await uploadCloudinary(
        updates.certificateTemplateBase64
      );
    }

    if (updates.type === "congress") {
      queryUpdate.congressPrice = {
        medico_especialista: 150,
        medico_general: 100,
        medico_rural: 100,
        profesional_salud: 100,
        estudiante: 50,
        ponencia_congreso_memorias: 150,
      };
    } else {
      queryUpdate.$unset = { congressPrice: 1 };
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(id, queryUpdate);
    return updatedCourse;
  },

  deleteCourse: async (id: string) => {
    const result = await CourseModel.findByIdAndDelete(id);
    return result;
  },
};
