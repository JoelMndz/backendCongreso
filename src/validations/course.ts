import Joi from 'joi';
import { joiMessages } from './joiMessage';

export const CourseValidation = {
  validateCreateCourse: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    photoURL: Joi.string().required(),
    price: Joi.number().required(),
    type: Joi.string().valid(...['workshop','congress']).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    certificateTemplateURL: Joi.string().required(),
  })
  .messages(joiMessages)
}
