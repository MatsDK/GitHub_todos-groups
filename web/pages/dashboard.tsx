import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  JoinGroupComponent,
  MeGroups,
  MeInvites,
  MeMe,
  TodosComponent,
} from "../generated/apolloComponents";
import { withAuth } from "../lib/HOC/withAuth";
import GroupLayout from "../src/components/Layout";
import { Title, GroupCard, GroupsGrid } from "../src/ui/Dashboard";

interface authPageProps {
  me: MeMe;
}

const Dashboard: React.FC<authPageProps> = ({ me }) => {
  const router = useRouter();
  const [groups] = useState<MeGroups[]>(me.groups);
  const [invites] = useState<MeInvites[]>(me.invites);

  console.log(groups);
  return (
    <GroupLayout me={me} title="Dashboard">
      <div style={{ marginTop: 50 }}>
        <Title>Groups</Title>
        <GroupsGrid>
          {groups.map((_: MeGroups, idx: number) => (
            <GroupCard key={idx}>
              <div>
                <Link href={`/group/${_.id}`}>
                  <span>
                    {_.name}/{_.repoName}
                  </span>
                </Link>
                <div>
                  <div>
                    <p>{_.activeTodosCount}</p>
                    <label> Active Todo{_.activeTodosCount > 1 && "s"}</label>
                  </div>
                  <div>
                    <p>{_.usersCount}</p>
                    <label> User{_.usersCount > 1 && "s"}</label>
                  </div>
                </div>
              </div>
            </GroupCard>
          ))}
        </GroupsGrid>
      </div>
      <div>
        <Title>My Todos</Title>
        <TodosComponent>
          {({ data, loading }) => {
            if (!data || loading || !data.todos) return null;

            return (
              <div>
                {data.todos.map((t, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Link href={`/group/${t.todoGroupId}/todo/${t.id}`}>
                      <span>{t.todoTitle}</span>
                    </Link>
                    {t.group && (
                      <div>
                        <Link href={`/group/${t.todoGroupId}`}>
                          <span>{t.group.name}</span>
                        </Link>
                        <span>
                          {t.group.activeTodosCount} Active Todo
                          {t.group.activeTodosCount > 1 && "s"}
                        </span>
                      </div>
                    )}
                    <span>{t.commentsCount} Comments</span>
                  </div>
                ))}
              </div>
            );
          }}
        </TodosComponent>
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
    </GroupLayout>
  );
};

export default withAuth(Dashboard);
