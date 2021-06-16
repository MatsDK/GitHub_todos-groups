import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import { getDataFromTree } from "react-apollo";
import initApollo from "../initApollo";
import { isBrowser } from "../isBrowser";

const docExists = () => typeof document !== "undefined";

const withApollo = (App: any) => {
  return class WithData extends React.Component {
    static displayName = `WithData(${App.displayName})`;
    static propTypes = {
      apolloState: PropTypes.object.isRequired,
    };

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
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        }
      );

      const githubApolloClient = initApollo(
        {},
        {
          getToken: () => {
            return `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`;
          },
        },
        {
          uri: "https://api.github.com/graphql",
          credentials: "omit",
        }
      );

      ctx.ctx.apolloClient = { ...apollo };
      ctx.ctx.githubApolloClient = { ...githubApolloClient };

      let appProps = {};
      if (App.getInitialProps) appProps = await App.getInitialProps(ctx);

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
              githubApolloClient={githubApolloClient}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          // console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    apolloClient: ApolloClient<NormalizedCacheObject>;
    githubApolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(props: any) {
      super(props);
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      // this.apolloClient = initApollo(props.apolloState, {
      // });
      this.apolloClient = initApollo(
        props.apolloState,
        {
          getToken: () => {
            return docExists() ? document.cookie : "";
          },
        },
        {
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        }
      );

      this.githubApolloClient = initApollo(
        props.apolloState,
        {
          getToken: () => {
            return `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`;
          },
        },
        {
          uri: "https://api.github.com/graphql",
          credentials: "omit",
        }
      );
    }

    render() {
      return (
        <App
          {...this.props}
          apolloClient={{ ...this.apolloClient }}
          githubApolloClient={{ ...this.githubApolloClient }}
        />
      );
    }
  };
};

export default withApollo;
