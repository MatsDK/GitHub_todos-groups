import { ApolloClient, InMemoryCache, ApolloReducerConfig } from "apollo-boost";
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
  [{ getToken: getServerToken }, { getToken: getGithubApiToken }]: Options[],
  [serverLinkOptions, githubApiLinkOptions]: HttpLink.Options[],
  cacheConfig: ApolloReducerConfig
) => {
  const serverHttpLink = createHttpLink(serverLinkOptions),
    githubHttpLink = createHttpLink(githubApiLinkOptions);

  const authLink = setContext((_, { headers = {} }) => {
    const serverToken: string = getServerToken(),
      githubToken: string = getGithubApiToken();

    headers.cookie = serverToken ? `${serverToken}` : "";
    headers.Authorization = githubToken ? `${githubToken}` : "";

    return {
      headers,
    };
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.split(
      (o: any) => o.getContext().server == "github",
      authLink.concat(githubHttpLink) as any,
      authLink.concat(serverHttpLink) as any
    ) as any,
    cache: new InMemoryCache(cacheConfig).restore(initialState || {}),
    // defaultOptions: {
    //   query: {
    //     fetchPolicy: "no-cache",
    //     errorPolicy: "all",
    //   },
    // },
  });
};

const initApollo = (
  initialState: any,
  options: Options[],
  linkOptions: HttpLink.Options[],
  cacheConfig: ApolloReducerConfig = {}
) => {
  if (!isBrowser)
    return create(initialState, options, linkOptions, cacheConfig);

  if (!apolloClient)
    apolloClient = create(initialState, options, linkOptions, cacheConfig);

  return apolloClient;
};

export default initApollo;
