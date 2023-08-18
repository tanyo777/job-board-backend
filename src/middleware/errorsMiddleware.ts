import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../utils/response/response";
import { UnauthorizedError } from "express-jwt";

const errorsMiddleware = (
  error: Error | Joi.ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof UnauthorizedError) {
    sendResponse(res, StatusCodes.UNAUTHORIZED, {
      msg: "Unauthorized",
    });
  } else if (error instanceof Joi.ValidationError) {
    let errors: string[] = [];

    error.details.forEach((error) => {
      errors.push(error.message);
    });

    sendResponse(res, StatusCodes.BAD_REQUEST, { errors });
  } else if (error instanceof Error) {
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      errors: [error.message],
    });
  }

  next();
};

export default errorsMiddleware;
