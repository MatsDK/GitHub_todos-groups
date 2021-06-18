import { NextPageContext } from "next";
import React from "react";
import { MeQuery } from "../../generated/apolloComponents";
// import { GetRepoObjectQuery } from "../../generated/github-apollo-components";
// import { getRepoObject } from "../../github-graphql/query/getRepo";
import { meQuery } from "../../graphql/user/query/me";
import { NextContextWithApollo } from "../../interfaces/types";
import { redirect } from "../redirect";

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

        if (!response || !response.data || !response.data.me) {
          return redirectToLogin(ctx);
        }

        // await apolloClient.query<GetRepoObjectQuery>({
        //   context: { clientName: "github" },
        //   query: getRepoObject,
        //   variables: {
        //     owner: "MatsDK",
        //     name: "SSH_Files",
        //   },
        // });

        return {
          me: response.data.me,
        };
      } catch (err) {
        console.log(err.networkError.result.errors);
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
