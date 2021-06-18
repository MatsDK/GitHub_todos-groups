import React from "react";
import { getDataFromTree } from "react-apollo";
import {
  ApolloClient,
  IntrospectionFragmentMatcher,
  IntrospectionResultData,
} from "apollo-boost";
import { NormalizedCacheObject } from "@apollo/client";
import initApollo from "../initApolloWithLinks";
import { isBrowser } from "../isBrowser";
import introspectionQueryResultData from "../../github-api-utils/github-api-fragments.json";
import { HttpLink } from "apollo-link-http";

const docExists = () => typeof document !== "undefined";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionQueryResultData as IntrospectionResultData,
});

const linkOptions: HttpLink.Options[] = [
  {
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  },
  {
    uri: "https://api.github.com/graphql",
    credentials: "omit",
  },
];

export const withApollo = (App: any) => {
  return class Apollo extends React.Component {
    // static displayName = "withApollo(App)";
    static async getInitialProps(ctx: any) {
      const {
        Component,
        router,
        ctx: { req, res },
      } = ctx;

      const apollo = initApollo(
        {},
        [
          {
            getToken: () => req.headers.cookie || "",
          },
          {
            getToken: () =>
              `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`,
          },
        ],
        linkOptions,
        { fragmentMatcher }
      );

      ctx.ctx.apolloClient = { ...apollo };

      let appProps = {};
      if (App.getInitialProps) appProps = await App.getInitialProps(ctx);

      if (res && res.finished) return {};

      if (!isBrowser) {
        try {
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          );
        } catch (error) {
          console.log(error);
        }
      }

      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(props: any) {
      super(props);
      const apollo = initApollo(
        props.apolloState,
        [
          {
            getToken: () => (docExists() ? document.cookie : ""),
          },
          {
            getToken: () =>
              `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`,
          },
        ],
        linkOptions,
        { fragmentMatcher }
      );
      this.apolloClient = apollo;
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
