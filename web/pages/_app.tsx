import { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient } from "apollo-boost";
import App from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { withApollo } from "../lib/HOC/withApolloLinks";
// import withApollo from "../lib/HOC/withApollo";
import "../src/css/global.css";

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
