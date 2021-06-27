import { NextPageContext } from "next";
import React from "react";
import { MeQuery } from "../../generated/apolloComponents";
import { meQuery } from "../../graphql/user/query/me";
import {
  NextContextWithApollo,
  NextFunctionComponent,
} from "../../interfaces/types";
import { redirect } from "../redirect";

export const withAuth = <T extends object>(
  Component: NextFunctionComponent<T>
) => {
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

        let appProps = {};
        if (Component.getInitialProps)
          appProps = await Component.getInitialProps({ ...ctx, apolloClient });

        return {
          me: response.data.me,
          ...appProps,
        };
      } catch (e) {
        console.log(e);
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
