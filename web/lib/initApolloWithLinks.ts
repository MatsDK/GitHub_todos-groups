// import {
//   NormalizedCacheObject,
//   Operation,
//   ApolloLink as x,
//   ApolloLink,
// } from "@apollo/client";
// import { ApolloClient, InMemoryCache } from "apollo-boost";
// import { setContext } from "apollo-link-context";
// import { createHttpLink } from "apollo-link-http";
// import { isBrowser } from "./isBrowser";

// let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

// const create = (
//   initialState: any,
//   { graphqlLink, serverLink }: apolloLinks,
//   { serverLinkToken, graphqlLinkToken }: any
// ) => {
//   // const serverHttpLink = createHttpLink({
//   //   uri: "http://localhost:4000/graphql",
//   //   credentials: "include",
//   // });
//   // const graphqlHttpLink = createHttpLink({
//   //   uri: "https://api.github.com/graphql",
//   //   credentials: "omit",
//   // });

//   const authLink = setContext((_, { headers = {} }) => {
//     headers.cookie = serverLinkToken() ? `${serverLinkToken()}` : "fdsafas";

//     return headers;
//   });

//   console.log(authLink);
//   const graphqlAuthLink = setContext((_, { headers = {} }) => {
//     return {
//       ...headers,
//       Authorization: graphqlLinkToken() ? `${graphqlLinkToken()}` : "",
//     };
//   });
//   // console.log(serverLinkToken(), graphqlLinkToken());

//   return new ApolloClient({
//     connectToDevTools: process.browser,
//     ssrMode: !process.browser,
//     // link: ApolloLink.split(
//     //   (o: Operation) => o.getContext().clientName == "github",
//     //   graphqlAuthLink.concat(graphqlHttpLink) as any,
//     //   authLink.concat(serverHttpLink) as any
//     // ) as any,
//     link: authLink.concat(serverLink),
//     cache: new InMemoryCache().restore(initialState || {}),
//   });
// };

// interface apolloLinks {
//   serverLink: any;
//   graphqlLink: any;
// }

// export const initApollo = (
//   initialState: any,
//   apolloLinks: apolloLinks,
//   apolloTokens: any
// ) => {
//   if (!isBrowser) return create(initialState, apolloLinks, apolloTokens);

//   if (!apolloClient)
//     apolloClient = create(initialState, apolloLinks, apolloTokens);

//   return apolloClient;
// };

import {
  ApolloClient,
  InMemoryCache,
  // NormalizedCacheObject,
} from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { isBrowser } from "./isBrowser";
import { ApolloLink } from "apollo-link";

let apolloClient: any = null;

interface Options {
  getToken: () => string;
}

const create = (
  initialState: any,
  { getToken }: Options,
  { getToken: getToken1 }: Options,
  linkOptions: HttpLink.Options,
  linkOptions1: HttpLink.Options
) => {
  const httpLink = createHttpLink(linkOptions);
  const httpLink2 = createHttpLink(linkOptions1);

  const authLink = setContext((_, { headers = {} }) => {
    const token: string = getToken();
    const token1: string = getToken1();

    headers.cookie = token ? `${token}` : "";
    headers.Authorization = token1 ? `${token1}` : "";

    return {
      headers,
    };
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.split(
      (o: any) => o.getContext().x == "github",
      authLink.concat(httpLink2) as any,
      authLink.concat(httpLink) as any
    ) as any,
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

const initApollo = (
  initialState: any,
  options: Options,
  options1: Options,
  linkOptions: HttpLink.Options,
  linkOptions1: HttpLink.Options
) => {
  if (!isBrowser)
    return create(initialState, options, options1, linkOptions, linkOptions1);

  if (!apolloClient)
    apolloClient = create(
      initialState,
      options,
      options1,
      linkOptions,
      linkOptions1
    );

  return apolloClient;
};

export default initApollo;
