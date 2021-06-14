import React from "react";
import Layout from "../components/Layout";
import { MeGroups, MeMe } from "../generated/apolloComponents";
import { withAuth } from "../lib/HOC/withAuth";

interface authPageProps {
  me: MeMe;
}

const auth: any = ({ me }: authPageProps) => {
  console.log(me.groups);

  return (
    <Layout title="Dashboard">
      <div>
        <span>{me.name}</span>
      </div>
      <div>
        <span>{me.email}</span>
      </div>
      <div>
        <b>Groups</b>
        {me.groups.map((_: MeGroups, idx: number) => {
          return <div key={idx}>{_.name}</div>;
        })}
      </div>
    </Layout>
  );
};

export default withAuth(auth);
