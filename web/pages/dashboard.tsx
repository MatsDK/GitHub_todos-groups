import React, { useState } from "react";
import Layout from "../src/components/Layout";
import {
  MeGroups,
  MeInvites,
  MeMe,
  JoinGroupComponent,
} from "../generated/apolloComponents";
import { withAuth } from "../lib/HOC/withAuth";
import Link from "next/link";
import { useRouter } from "next/router";

interface authPageProps {
  me: MeMe;
}

const auth: any = ({ me }: authPageProps) => {
  const router = useRouter();
  const [groups] = useState<MeGroups[]>(me.groups);
  const [invites] = useState<MeInvites[]>(me.invites);

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
        {groups.map((_: MeGroups, idx: number) => (
          <Link key={idx} href={`/group/${_.id}`}>
            <div>{_.name}</div>
          </Link>
        ))}
      </div>
      <div>
        <b>Invites</b>
        <JoinGroupComponent>
          {(joinGroup) => (
            <div>
              {invites.map((_: MeInvites, idx: number) => {
                return (
                  <div style={{ display: "flex" }} key={idx}>
                    <p style={{ margin: 0 }}>{_.name}</p>
                    <button
                      onClick={async () => {
                        const res = await joinGroup({
                          variables: { groupId: parseInt(_.id) },
                        });

                        if (res && res.data && res.data.joinGroup)
                          router.push(`/group/${_.id}`);
                      }}
                    >
                      Accept
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </JoinGroupComponent>
      </div>
    </Layout>
  );
};

export default withAuth(auth);
