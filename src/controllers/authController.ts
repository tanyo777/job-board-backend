import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginSchema, registerSchema } from "../utils/validation/auth.schema";
import joiValidate from "../utils/validation/joiValidate";
import sendResponse from "../utils/response/response";
import { StatusCodes } from "http-status-codes";
import envConfig from "../config/envConfig";
import { getUserByEmail } from "../services/user.service";

export const register = async (req: Request, res: Response) => {
  // validate payload
  joiValidate(req, registerSchema);

  // hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // create user in the db

  // send response
  sendResponse(res, StatusCodes.OK, { msg: "User created successfully" });
};

export const login = async (req: Request, res: Response) => {
  // validate payload
  joiValidate(req, loginSchema);

  // check if user with this email exists
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  // compare password
  const comparedPw = await bcrypt.compare(password, user.password);

  if (!comparedPw) throw Error("Invalid credentials");

  // sign jwt with a secret
  const accessToken = jwt.sign(
    { userId: user.id },
    envConfig.jwtAccessTokenSecret as string,
    {
      expiresIn: "24h",
    }
  );
  sendResponse(res, StatusCodes.OK, { token: accessToken, email });
};

export const logout = (req: Request, res: Response) => {
  console.log("http", (req as any).auth);
  res.json({ msg: "Logout" });
};
