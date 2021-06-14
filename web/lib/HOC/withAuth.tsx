import React from "react";
import { NextContextWithApollo } from "../../interfaces/types";
import { redirect } from "../redirect";
import { NextPageContext } from "next";
import { meQuery } from "../../graphql/user/mutations/me";
import { MeQuery } from "../../generated/apolloComponents";

export const withAuth = <T extends object>(Component: React.FC<T>) => {
  return class AuthComponent extends React.Component<T> {
    static async getInitialProps({
      apolloClient,
      ...ctx
    }: NextContextWithApollo) {
      try {
        const response = await apolloClient.query<MeQuery>({
          query: meQuery,
        });

        if (!response || !response.data || !response.data.me)
          return redirectToLogin(ctx);

        return {
          me: response.data.me,
        };
      } catch {
        return redirectToLogin(ctx);
      }
    }
    render() {
      return <Component {...this.props} />;
    }
  };
};

const redirectToLogin = (ctx: NextPageContext) => {
  redirect(ctx, "/login");
  return {
    me: null,
  };
};
