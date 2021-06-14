import { logoutMutation } from "../graphql/user/mutations/logout";
import { NextContextWithApollo } from "../interfaces/types";
import { redirect } from "../lib/redirect";

const Logout = (): null => {
  return null;
};

Logout.getInitialProps = async ({
  apolloClient,
  ...ctx
}: NextContextWithApollo) => {
  await apolloClient.mutate({ mutation: logoutMutation });
  await apolloClient.resetStore();
  redirect(ctx, "/");
  return {};
};

export default Logout;
