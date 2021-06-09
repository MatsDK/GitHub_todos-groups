import { NormalizedCacheObject } from "@apollo/client";
import ApolloClient from "apollo-client";
import { NextPageContext } from "next";

export interface NextContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}
