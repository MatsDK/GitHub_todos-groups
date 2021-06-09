import * as React from "react";
import Layout from "../components/Layout";
import { MeComponent } from "../generated/apolloComponents";
// import { meQuery } from "../graphql/user/mutations/me";

const IndexPage: React.FunctionComponent = () => {
  return (
    <Layout title="Home">
      <h1>Home</h1>
      <MeComponent>
        {({ data }: any) => {
          return <div>{console.log(data)}test</div>;
        }}
      </MeComponent>
    </Layout>
  );
};

export default IndexPage;
