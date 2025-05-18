// src\config\configurationBase.ts
export class ConfigurationBase {
  app_name: string;
  version: string;
  env: {
    mode: string;
    port: number;
  };
  graphQL: {
    schemaFileName: boolean | string;
    playground: boolean;
    introspection: boolean;
    installSubscriptionHandlers: boolean;
  };
  jwt: {
    refreshTokenName: string;
    secret: string;
    signOptions: {
      expiresIn: string;
    };
  };
  db: {
    connection_string: string;
    name: string;
  };
  morgans?: {
    url?: string;
  };
  throttle: Array<{
    ttl: number;
    limit: number;
  }>;
}