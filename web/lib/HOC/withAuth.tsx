import React from "react";
import { NextContextWithApollo } from "../../interfaces/types";
import { redirect } from "../redirect";
import cookie from "cookie";
import { MeMutation } from "../../generated/apolloComponents";
import { meMutation } from "../../graphql/user/mutations/me";

export const withAuth = <T extends object>(Component: React.FC<T>) => {
  return class AuthComponent extends React.Component<T> {
    static async getInitialProps({ apolloClient, ...ctx }: NextContextWithApollo) {
      try {
        let mutationVariables = { accessToken: "", refreshToken: "" };
        if (ctx.req) {
          const tokens = cookie.parse(ctx.req.headers?.cookie || "")
          mutationVariables = {
            accessToken: tokens["access-token"] || "",
            refreshToken: tokens["refresh-token"] || "",
          };

          if(!mutationVariables.accessToken && !mutationVariables.refreshToken) 
            return redirectToLogin(ctx)
        }

        const response = await apolloClient.mutate<MeMutation>({
          mutation: meMutation,
          variables: mutationVariables,
        });

        if (!response || !response.data || !response.data.me) 
          return redirectToLogin(ctx)
        

        return {
          me: response.data.me,
        };
      } catch {
        return redirectToLogin(ctx)
      }
    }
    render() {
      return <Component {...this.props} />;
    }
  };
};

const redirectToLogin = (ctx: any) => {
  redirect(ctx, "/login");
  return {
    me: null,
  };
}
