import { NormalizedCacheObject } from "@apollo/client";
import ApolloClient from "apollo-client";
import { NextPageContext } from "next";
import React from "react";
import { meQuery } from "../graphql/user/mutations/me";
import { redirect } from "./redirect";

interface NextContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export const withAuth = <T extends object>(Component: React.FC<T>) => {
  return class AuthComponent extends React.Component<T> {
    static async getInitialProps({
      apolloClient,
      ...ctx
    }: NextContextWithApollo) {
      const response = await apolloClient.query({ query: meQuery });

      if (!response || !response.data || !response.data.me) {
        redirect(ctx, "/login");
        return {
          me: null,
        };
      }

      console.log("authenticated");

      return {
        me: "data",
      };
    }

    render() {
      return <Component {...this.props} />;
    }
  };
};
