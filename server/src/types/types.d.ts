import { Request, Response } from "express";

type reqContext = Request & { userId: number };

export interface MyContext {
  req: reqContext;
  res: Response;
  usersLoader: any;
  groupsLoader: any;
  groupsLoaderById: any;
  invitesLoader: any;
  authorsLoader: any;
  commentsLoader: any;
  nestedCommentsLoader: any;
  countsLoader: any;
}
