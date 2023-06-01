import { Request, Response } from "express";
import { CourseService } from "../services";
import { handleError } from "../error";

export const CourseController = {
  createCourse: async (req: Request, res: Response) => {
    try {
      const data = await CourseService.createCourse(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  getAllCourses: async (req: Request, res: Response) => {
    try {
      const data = await CourseService.getAllCourses();
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  getCourseById: async (req: Request, res: Response) => {
    try {
      const data = await CourseService.getCourseById(req.params.id);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  updateCourse: async (req: Request, res: Response) => {
    try {
      const data = await CourseService.updateCourse(req.params.id, req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  deleteCourse: async (req: Request, res: Response) => {
    try {
      const data = await CourseService.deleteCourse(req.params.id);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },
};
