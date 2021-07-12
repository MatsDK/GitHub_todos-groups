import { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient } from "apollo-boost";
import App from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import styled, { ThemeProvider } from "styled-components";
import { withApollo } from "../lib/HOC/withApolloLinks";
import "../src/css/global.css";
import { darkTheme } from "../src/utils/themes";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.mainBgColor};
  color: ${(props) => props.theme.textColors[1]};
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <ThemeProvider theme={darkTheme}>
        <Wrapper className="Wrapper">
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

export default withApollo(MyApp);
