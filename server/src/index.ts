import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { createGroupsLoader } from "./utils/dataLoaders/groupsLoader";
import { createUsersLoader } from "./utils/dataLoaders/usersLoader";

dotenv.config();

(async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    // dropSchema: true,
    database: "typegraphql",
    synchronize: true,
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
