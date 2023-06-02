import { CourseModel } from "../models";
import { CourseValidation } from "../validations";
import { uploadCloudinary } from "../utils";
interface ICreateCourse {
  title: string,
  description: string,
  photoBase64: string,
  price: number,
  type: string,
  startDate: Date,
  endDate: Date,
  certificateTemplateBase64: string
}

export const CourseService = {
  createCourse: async (entity: ICreateCourse) => {
    const { error } = CourseValidation.validateCreateCourse.validate(entity);
    if (error) {
      throw new Error(error.message);
    }
    const photoURL = await uploadCloudinary(entity.photoBase64);
    const certificateTemplateURL = await uploadCloudinary (entity.certificateTemplateBase64);
    const newCourse = await CourseModel.create({
      title: entity.title,
      description: entity.description,
      photoURL: photoURL,
      price: entity.price,
      type: entity.type,
      startDate: entity.startDate,
      endDate: entity.endDate,
      certificateTemplateURL: certificateTemplateURL
    });
    return newCourse;
  },

  getAllCourses: async () => {
    const courses = await CourseModel.find();
    return courses;
  },

  getCourseById: async (id: string) => {
    const course = await CourseModel.findById(id);
    return course;
  },

  updateCourse: async (id: string, updates: Partial<ICreateCourse>) => {
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
      queryUpdate.certificateTemplateURL = await uploadCloudinary(updates.certificateTemplateBase64);
    }
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, updates);
    return updatedCourse;
  },

  deleteCourse: async (id: string) => {
    const result = await CourseModel.findByIdAndDelete(id);
    return result;
  },
};
