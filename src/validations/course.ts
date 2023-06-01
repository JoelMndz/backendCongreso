import Joi from "joi";
import { joiMessages } from "./joiMessage";

export const CourseValidation = {
  validateCreateCourse: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    photoBase64: Joi.string()
      .custom((value, helpers) => {
        if (
          !new RegExp(
            /^data:([a-z]+\/[a-z]+);base64,([a-zA-Z0-9+/]+={0,2})$/
          ).test(value)
        ) {
          return helpers.error("string.custom.validarBase64");
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
  }).messages(joiMessages),
};
