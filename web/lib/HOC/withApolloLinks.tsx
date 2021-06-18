import React from "react";
import Head from "next/head";
import { getDataFromTree } from "react-apollo";
import { ApolloClient } from "apollo-boost";
import {
  // ApolloLink,
  // createHttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import initApollo from "../initApolloWithLinks";
import { isBrowser } from "../isBrowser";

const docExists = () => typeof document !== "undefined";

// const serverLink: ApolloLink = createHttpLink({
//   uri: "http://localhost:4000/graphql",
//   headers: {
//     credentials: "include",
//     cookie: "",
//   },
// });

// const graphqlLink: ApolloLink = createHttpLink({
//   uri: "https://api.github.com/graphql",
//   headers: {
//     credentials: "omit",
//     Authorazation: `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`,
//   },
// });
// const serverLink = new HttpLink({
//   uri: "http://localhost:4000/graphql",
//   headers: {
//     Credentials: "include",
//     cookie: "",
//   },
// });

// const graphqlLink = new HttpLink({
//   uri: "https://api.github.com/graphql",
//   headers: {
//     Credentials: "include",
//     Authorazation: `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`,
//   },
// });

export const withApollo = (App: any) => {
  return class Apollo extends React.Component {
    static displayName = "withApollo(App)";
    static async getInitialProps(ctx: any) {
      const {
        Component,
        router,
        ctx: { req, res },
      } = ctx;

      const apollo = initApollo(
        {},
        {
          getToken: () => req.headers.cookie || "",
        },
        {
          getToken: () => {
            return `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`;
          },
        },
        {
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        },
        {
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        }
      );

      ctx.ctx.apolloClient = { ...apollo };

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data

      if (res && res.finished)
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};

      if (!isBrowser) {
        // Run all graphql queries in the component tree
        // and extract the resulting data
        try {
          // Run all GraphQL queries
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
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          // console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
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
        {
          getToken: () => {
            return docExists() ? document.cookie : "";
          },
        },
        {
          getToken: () => {
            return `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`;
          },
        },
        {
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        },
        {
          uri: "https://api.github.com/graphql",
          credentials: "omit",
        }
      );
      this.apolloClient = apollo;
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
