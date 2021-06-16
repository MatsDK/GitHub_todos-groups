import { ApolloLink } from "apollo-link";
import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import { NormalizedCacheObject, Operation } from "@apollo/client";
import { isBrowser } from "./isBrowser";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const firstLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  headers: {
    credentials: "include",
    cookie: "",
  },
});

const secondLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: {
    credentials: "omit",
    Authorazation: `bearer ${process.env.GITHUB_ACCESS_TOKEN as string}`,
  },
});

const create = (initialState: any) => {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: ApolloLink.split(
      (o: Operation) => o.getContext().clientName == "github",
      secondLink as any,
      firstLink as any
    ) as any,
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

export const initApollo = (initialState: any) => {
  if (!isBrowser) return create(initialState);

  if (!apolloClient) apolloClient = create(initialState);

  return apolloClient;
};
