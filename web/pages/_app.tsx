import App from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
// import withApollo from "../lib/HOC/withApollo";
import "../src/css/global.css";
import { ApolloClient } from "apollo-boost";
import { NormalizedCacheObject } from "@apollo/client";
import { withApollo } from "../lib/HOC/withApolloLinks";

interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </>
    );
  }
}

export default withApollo(MyApp);
