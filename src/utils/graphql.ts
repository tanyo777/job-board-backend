import { Response } from "express";
import { throwGqlError } from "./response/customErrors";
import { getUserById } from "../services/user.service";

interface IGraphQLContextArgs {
  req: any;
  res: Response;
}

interface IUser {
  id: string;
  email: string;
  companyId: string;
  createdAt: Date;
}

export interface IGraphQLContextResponse {
  user?: IUser;
}

export const getContextFunction = async ({
  req,
}: IGraphQLContextArgs): Promise<IGraphQLContextResponse> => {
  const auth = req.auth;

  const context: IGraphQLContextResponse = {};

  // create batch functions for every request so we avoid the caching of the results

  if (!auth) {
    throwGqlError("Unauthorized", "UNAUTHORIZED");
  }

  const userId = auth.userId;
  const { password, ...user } = await getUserById(userId);

  if (!user) {
    throwGqlError("Unauthorized", "UNAUTHORIZED");
  }

  context.user = user;

  return context;
};
