import React from "react";
import { GroupComponent, GroupGroup } from "../../generated/apolloComponents";
import { GetRepoObjectComponent } from "../../generated/github-apollo-components";
import GroupView from "./GroupView";

interface Props {
  group: string;
  path: string;
}

const GroupContainer: React.FC<Props> = ({ group, path }) => {
  return (
    <div>
      {typeof group == "string" && (
        <GroupComponent variables={{ groupId: parseInt(group as string) }}>
          {({ data }) => {
            if (!data || !data.group) return null;

            return (
              <GetRepoObjectComponent
                context={{ server: "github" }}
                variables={{
                  owner: "MatsDK",
                  name: data.group.repoName,
                  expression: `${data.group.mainBranch}:${path}`,
                }}
              >
                {({ data: repoData }) => {
                  console.log(repoData, data);
                  if (!repoData || !repoData.repository) return null;

                  return (
                    <GroupView
                      path={{ groupId: data.group!.id, path }}
                      group={data.group as GroupGroup}
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
