import React from "react";
import {
  GroupComponent,
  GroupGroup,
  GroupTodos,
} from "../../generated/apolloComponents";
import { GetRepoObjectComponent } from "../../generated/github-apollo-components";
import GroupView from "./GroupView";

interface Props {
  group: string;
  path: string[];
}

const GroupContainer: React.FC<Props> = ({ group, path }) => {
  return (
    <div>
      {typeof group == "string" && (
        <GroupComponent
          // fetchPolicy="cache-and-network"
          variables={{
            path: path.join("/"),
            groupId: parseInt(group as string),
          }}
        >
          {({ data }) => {
            if (!data || !data.group) return null;
            const group: GroupGroup = {
              ...data.group,
              todos: data.group.todos.filter((_: GroupTodos) =>
                _.fileName.includes(path.join("/"))
              ),
            };

            return (
              <GetRepoObjectComponent
                context={{ server: "github" }}
                variables={{
                  owner: data.group.repoOwner,
                  name: data.group.repoName,
                  expression: `${data.group.mainBranch}:${path.join("/")}`,
                }}
              >
                {({ data: repoData }) => {
                  if (!repoData || !repoData.repository) return null;

                  return (
                    <GroupView
                      path={{ groupId: data.group!.id, path }}
                      group={group}
                      repoData={repoData.repository}
                    />
                  );
                }}
              </GetRepoObjectComponent>
            );
          }}
        </GroupComponent>
      )}
    </div>
  );
};

export default GroupContainer;
