import {
  ApolloClient,
  InMemoryCache,
  // NormalizedCacheObject,
} from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { isBrowser } from "./isBrowser";

let apolloClient: any = null;

interface Options {
  getToken: () => string;
}

const create = (
  initialState: any,
  { getToken }: Options,
  linkOptions: HttpLink.Options
) => {
  const httpLink = createHttpLink(linkOptions);

  const authLink = setContext((_, { headers = {} }) => {
    const token: string = getToken();

    if (linkOptions.credentials == "omit")
      headers.Authorization = token ? `${token}` : "";
    else headers.cookie = token ? `${token}` : "";

    return {
      headers,
    };
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

const initApollo = (
  initialState: any,
  options: Options,
  linkOptions: HttpLink.Options
) => {
  if (!isBrowser) return create(initialState, options, linkOptions);

  if (!apolloClient) apolloClient = create(initialState, options, linkOptions);

  return apolloClient;
};

export default initApollo;
