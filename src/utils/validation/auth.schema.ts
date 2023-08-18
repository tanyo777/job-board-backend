import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "Firstname is required",
    "string.empty": "Firstname is required",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Lastname is required",
    "string.empty": "Lastname is required",
  }),
  email: Joi.string().required().email().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.email": "Invalid email",
  }),
  password: Joi.string().required().min(8).messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().equal(Joi.ref("password")).required().messages({
    "any.required": "Password confirmation is required",
    "string.empty": "Password confirmation is required",
    "any.only": "Passwords don't match",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.email": "Invalid email",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
