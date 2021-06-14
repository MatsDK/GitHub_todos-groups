import {
  ApolloClient,
  InMemoryCache,
  // NormalizedCacheObject,
} from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { isBrowser } from "./isBrowser";

let apolloClient: any = null;

interface Options {
  getToken: () => string;
}

const create = (initialState: any, { getToken }: Options) => {
  const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  });

  const authLink = setContext((_, { headers }) => {
    const token: any = getToken();
    return {
      headers: {
        ...headers,
        cookie: token ? `${token}` : "",
      },
    };
  });

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

const initApollo = (initialState: any, options: Options) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) return create(initialState, options);

  // Reuse client on the client-side
  if (!apolloClient) apolloClient = create(initialState, options);

  return apolloClient;
};

export default initApollo;
