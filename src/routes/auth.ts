import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import { login, logout, register } from "../controllers/authController";
import auth from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.route("/register").post(expressAsyncHandler(register));
authRouter.route("/login").post(expressAsyncHandler(login));

authRouter.use(auth);
authRouter.route("/logout").post(expressAsyncHandler(logout));

export default authRouter;
