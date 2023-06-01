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
}

export const CourseService = {
  createCourse: async (entity: ICreateCourse) => {
    const { error } = CourseValidation.validateCreateCourse.validate(entity);
    if (error) {
      throw new Error(error.message);
    }
    const photoURL = await uploadCloudinary(entity.photoBase64);
    const newCourse = await CourseModel.create({
      title: entity.title,
      description: entity.description,
      photoURL: photoURL,
      price: entity.price,
      type: entity.type,
      startDate: entity.startDate,
      endDate: entity.endDate,
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
    const { error } = CourseValidation.validateCreateCourse.validate(updates);
    if (error) {
      throw new Error(error.message);
    }
    const allowedUpdates: (keyof ICreateCourse)[] = [
      "title",
      "description",
      "photoBase64",
      "price",
      "type",
      "startDate",
      "endDate",
    ];
    const updatesKeys = Object.keys(updates) as (keyof ICreateCourse)[];
    const isValidOperation = updatesKeys.every((key) =>
      allowedUpdates.includes(key)
    );
    if (!isValidOperation) {
      throw new Error("Invalid updates!");
    }
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return updatedCourse;
  },

  deleteCourse: async (id: string) => {
    const result = await CourseModel.findByIdAndDelete(id);
    return result;
  },
};
