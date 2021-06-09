import { NextPageContext } from "next";
import Router from "next/router";

export const redirect = (context: NextPageContext, target: string) => {
  if (context.res) {
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else Router.replace(target);
};
