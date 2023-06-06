import Joi from "joi";
import { joiMessages } from "./joiMessage";

export const CourseValidation = {
  validateCreateCourse: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    photoBase64: Joi.string()
      .custom((value, helpers) => {
        if (
          !new RegExp(
            /^data:([a-z]+\/[a-z]+);base64,([a-zA-Z0-9+/]+={0,2})$/
          ).test(value)
        ) {
          return helpers.error("string.custom.validateBase64");
        }
        return value;
      })
      .required(),
    price: Joi.number().required(),
    type: Joi.string()
      .valid(...["workshop", "congress"])
      .required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    certificateTemplateBase64: Joi.string()
      .custom((value, helpers) => {
        if (
          !new RegExp(
            /^data:([a-z]+\/[a-z]+);base64,([a-zA-Z0-9+/]+={0,2})$/
          ).test(value)
        ) {
          return helpers.error("string.custom.validateBase64");
        }
        return value;
      }),
  }).messages(joiMessages),

  validateUpdateCourse: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    photoBase64: Joi.string().custom((value, helpers) => {
      if (
        !new RegExp(
          /^data:([a-z]+\/[a-z]+);base64,([a-zA-Z0-9+/]+={0,2})$/
        ).test(value)
      ) {
        return helpers.error("string.custom.validateBase64");
      }
      return value;
    }).optional(),
    price: Joi.number(),
    type: Joi.string().valid(...["workshop", "congress"]),
    startDate: Joi.date(),
    endDate: Joi.date(),
    certificateTemplateBase64: Joi.string().custom((value, helpers) => {
      if (
        !new RegExp(
          /^data:([a-z]+\/[a-z]+);base64,([a-zA-Z0-9+/]+={0,2})$/
        ).test(value)
      ) {
        return helpers.error("string.custom.validateBase64");
      }
      return value;
    }).optional(),
  }).messages(joiMessages),
};
