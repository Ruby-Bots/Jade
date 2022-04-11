declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      MONGO_DB: string;
      KEY: string;
      OWNER_ID: string;
      PROD: string;
      INVITE: string;
      URL: string;
    }
  }
}

export {}
