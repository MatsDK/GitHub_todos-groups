import React from "react";
import Layout from "../src/components/Layout";
import { MeGroups, MeInvites, MeMe } from "../generated/apolloComponents";
import { withAuth } from "../lib/HOC/withAuth";
import Link from "next/link";

interface authPageProps {
  me: MeMe;
}

const auth: any = ({ me }: authPageProps) => {
  console.log(me);

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
          return (
            <Link key={idx} href={`/group/${_.id}`}>
              <div>{_.name}</div>
            </Link>
          );
        })}
      </div>
      <div>
        <b>Invites</b>
        {me.invites.map((_: MeInvites, idx: number) => {
          return <div key={idx}>{_.name}</div>;
        })}
      </div>
    </Layout>
  );
};

export default withAuth(auth);
