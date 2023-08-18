export interface IEnvConfig {
  port: number;
  clientUrl: string | undefined;
  jwtAccessTokenSecret: string | undefined;
  dbConnectionString: string | undefined;
}

export interface IGQLContext {
  token?: string;
}

export interface ICreatedAtField {
  createdAt: string;
}
