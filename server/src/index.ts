import { ApolloServer } from "apollo-server-express";
import Express from "express";
import cors from "cors";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
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
    context: ({ req, res }: any) => ({ req, res }),
  });

  const app = Express();

  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  // app.use(
  //   session({
  //     store: new RedisStore({
  //       client: redis,
  //     }),
  //     name: "qid",
  //     secret: "aslkdfjoiq12312",
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
  //     },
  //   })
  // );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("> Server started on http://localhost:4000/graphql");
  });
})();
