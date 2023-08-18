import { GraphQLError } from "graphql";

export const throwGqlError = (message: string, code: string) => {
  throw new GraphQLError(message, { extensions: { code } });
};
