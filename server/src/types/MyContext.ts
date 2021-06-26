import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  usersLoader: any;
  groupsLoader: any;
  invitesLoader: any;
  todoLoader: any;
  commentsLoader: any;
}
