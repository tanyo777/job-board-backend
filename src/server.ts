import fs from "fs";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import jwt from "jsonwebtoken";

import { jwtVerify } from "./middleware/authMiddleware";
import errorsMiddleware from "./middleware/errorsMiddleware";
import router from "./routes";
import prisma from "../prisma/client";
import envConfig from "./config/envConfig";
import resolvers from "./graphql/resolvers";
import { IGraphQLContextResponse, getContextFunction } from "./utils/graphql";
import { getUserById } from "./services/user.service";

export const main = async () => {
  const expressServer = express();

  const typeDefs = fs.readFileSync("src/graphql/schema.gql", "utf-8");

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const gqlServer = new ApolloServer<IGraphQLContextResponse>({ schema });

  expressServer.use(cors(), express.json(), jwtVerify);

  // HTTP
  expressServer.use("/api", router);
  expressServer.use(errorsMiddleware);

  const httpServer = createServer(expressServer);

  // GraphQL
  await gqlServer.start();
  expressServer.use(
    "/graphql",
    apolloMiddleware(gqlServer, {
      context: getContextFunction,
    })
  );

  // GraphQL WS Server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const getWsContext = async ({ connectionParams }: any) => {
    const token = connectionParams?.token;

    if (token) {
      const payload: any = jwt.verify(
        token,
        envConfig.jwtAccessTokenSecret as string
      );

      const { password, ...user } = await getUserById(payload.userId);

      return { user };
    }

    return {};
  };

  useServer({ schema, context: getWsContext }, wsServer);

  httpServer.listen(envConfig.port, () => {
    console.log(
      `Express http server running at http://localhost:${envConfig.port}`
    );
    console.log(
      `GraphQL server running at http://localhost:${envConfig.port}/graphql`
    );
  });
};

prisma
  .$connect()
  .then(() => {
    main();
  })
  .catch((err) => console.log(err));
