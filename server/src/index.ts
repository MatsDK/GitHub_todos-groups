import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { createCommentsLoader } from "./utils/dataLoaders/commentsLoader";
import { createGroupsLoader } from "./utils/dataLoaders/groupsLoader";
import { createInvitesLoader } from "./utils/dataLoaders/invitesLoader";
import { createUsersLoader } from "./utils/dataLoaders/usersLoader";

dotenv.config();

(async () => {
  await createConnection({
    type: "postgres",
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    // dropSchema: true,
    logging: true,
    entities: ["src/entity/*.*"],
  });

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
      usersLoader: createUsersLoader(),
      groupsLoader: createGroupsLoader(),
      invitesLoader: createInvitesLoader(),
      commentsLoader: createCommentsLoader(),
    }),
  });

  const app = Express();

  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("> Server started on http://localhost:4000/graphql");
  });
})();
