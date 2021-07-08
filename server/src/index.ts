import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { createAuthorsLoader } from "./utils/dataLoaders/authorsLoader";
import {
  createCommentsLoader,
  createNestedCommentsLoader,
} from "./utils/dataLoaders/commentsLoader";
import { createGroupsLoader } from "./utils/dataLoaders/groupsLoader";
import { createInvitesLoader } from "./utils/dataLoaders/invitesLoader";
import { createUsersLoader } from "./utils/dataLoaders/usersLoader";
import { createCountsLoader } from "./utils/dataLoaders/countLoader";

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

  const dataLoaders = {
    usersLoader: createUsersLoader(),
    groupsLoader: createGroupsLoader(),
    invitesLoader: createInvitesLoader(),
    commentsLoader: createCommentsLoader(),
    authorsLoader: createAuthorsLoader(),
    nestedCommentsLoader: createNestedCommentsLoader(),
    countsLoader: createCountsLoader(),
  };

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/modules/**/*.ts"],
    }),
    context: ({ req, res }: any) => ({
      req,
      res,
      ...dataLoaders,
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
