import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  JoinGroupComponent,
  MeGroups,
  MeInvites,
  MeMe,
} from "../generated/apolloComponents";
import { withAuth } from "../lib/HOC/withAuth";
import Layout from "../src/components/Layout";

interface authPageProps {
  me: MeMe;
}

const auth: React.FC<authPageProps> = ({ me }) => {
  const router = useRouter();
  const [groups] = useState<MeGroups[]>(me.groups);
  const [invites] = useState<MeInvites[]>(me.invites);

  return (
    <Layout me={me} title="Dashboard">
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
