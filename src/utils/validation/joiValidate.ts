import { Request } from "express";
import Joi from "joi";

const joiValidate = (req: Request, schema: Joi.Schema) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    throw error;
  }
};

export default joiValidate;
