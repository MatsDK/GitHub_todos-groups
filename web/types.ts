import { NormalizedCacheObject } from "@apollo/client";
import ApolloClient from "apollo-client";
import { NextPageContext } from "next";

export interface NextContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

export interface NextFunctionComponent<T = {}> {
  (props: T): any;
  getInitialProps?: (props: NextContextWithApollo) => Promise<any>;
}
