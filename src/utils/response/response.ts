import { Response } from "express";
import { StatusCodes } from "http-status-codes";

const sendResponse = (res: Response, statusCode: StatusCodes, data?: any) => {
  res.status(statusCode).json(data);
};

export default sendResponse;
