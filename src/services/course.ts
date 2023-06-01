import { CourseModel } from "../models";
import { CourseValidation } from "../validations";

interface ICreateCourse {
  title: string;
  description: string;
  photoURL: string;
  price: number;
  type: string;
  startDate: Date;
  endDate: Date;
  certificateTemplateURL: string;
}

export const CourseService = {
  createCourse: async (entity: ICreateCourse) => {
    const { error } = CourseValidation.validateCreateCourse.validate(entity);
    if (error) {
      throw new Error(error.message);
    }
    const newCourse = await CourseModel.create({
      title: entity.title,
      description: entity.description,
      photoURL: entity.photoURL,
      price: entity.price,
      type: entity.type,
      startDate: entity.startDate,
      endDate: entity.endDate,
      certificateTemplateURL: entity.certificateTemplateURL,
      });
    return newCourse;
  },

  getAllCourses: async () => {
    const courses = await CourseModel.find();
    return courses;
  },

  getCourseById: async (id: string) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw new Error("No se encontró el curso");
      }
      return course;
    } catch (error) {
      console.error("Error al obtener el curso por ID:", error);
      throw error;
    }
  },

  updateCourse: async (id: string, entity: ICreateCourse) => {
    try {
      const updatedCourse = await CourseModel.findByIdAndUpdate(id, entity, {
        new: true,
      });
      if (!updatedCourse) {
        throw new Error("No se encontró el curso");
      }
      return updatedCourse;
    } catch (error) {
      console.error("Error al actualizar el curso:", error);
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    const result = await CourseModel.findByIdAndDelete(id);
    return result;
  },
};
