import { expressjwt } from "express-jwt";

import envConfig from "../config/envConfig";
import sendResponse from "../utils/response/response";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Response } from "express";

export const jwtVerify = expressjwt({
  credentialsRequired: false,
  algorithms: ["HS256"],
  secret: envConfig.jwtAccessTokenSecret as string,
});

const auth = (req: any, res: Response, next: NextFunction) => {
  if (!(req as any).auth) {
    sendResponse(res, StatusCodes.UNAUTHORIZED, { msg: "Unauthorized" });
  } else {
    next();
  }
};

export default auth;
