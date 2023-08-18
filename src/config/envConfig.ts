import dotenv from "dotenv";

dotenv.config();

import { IEnvConfig } from "../types/objectTypes";

const envConfig: IEnvConfig = {
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL,
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
};

export default envConfig;
