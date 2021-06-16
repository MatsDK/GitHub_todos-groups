import React from "react";
import Layout from "../src/components/Layout";
import { MeGroups, MeMe } from "../generated/apolloComponents";
import { withAuth } from "../lib/HOC/withAuth";
import Link from "next/link";

interface authPageProps {
  me: MeMe;
}

const auth: any = ({ me }: authPageProps) => {
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
    </Layout>
  );
};

export default withAuth(auth);
