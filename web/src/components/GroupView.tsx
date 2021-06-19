import Link from "next/link";
import React from "react";
import { GroupGroup, GroupUsers } from "../../generated/apolloComponents";
import {
  GetRepoObjectBlobInlineFragment,
  GetRepoObjectRepository,
  GetRepoObjectTreeInlineFragment,
} from "../../generated/github-apollo-components";

interface Props {
  group: GroupGroup;
  repoData: GetRepoObjectRepository;
  path: { groupId: string; path: string };
}

const GroupView: React.FC<Props> = ({
  group,
  repoData,
  path: { groupId, path },
}) => {
  return (
    <div>
      <p>{group.name}</p>
      <div>
        <h2>users</h2>
        {group.users.map((user: GroupUsers, idx: number) => {
          return (
            <div style={{ display: "flex" }} key={idx}>
              <p>{user.name}</p> <p>--</p> <p>{user.email}</p>
            </div>
          );
        })}
        <h2>Files</h2>
        <Files groupId={groupId} path={path} repoData={repoData} />
      </div>
    </div>
  );
};

interface FilesProps {
  repoData: GetRepoObjectRepository;
  groupId: string;
  path: string;
}

const Files: React.FC<FilesProps> = ({ repoData, groupId, path }) => {
  if (!repoData.object) return null;

  if (repoData.object.__typename !== "Tree")
    return (
      <pre>{(repoData.object as GetRepoObjectBlobInlineFragment).text}</pre>
    );

  if (!(repoData.object as GetRepoObjectTreeInlineFragment).entries)
    return null;

  return (
    <div>
      {(repoData.object as GetRepoObjectTreeInlineFragment).entries!.map(
        (_, idx: number) => {
          const newPath =
            `/group/${groupId}` +
            (path ? `/${[path, _.name].join("/")}` : `/${_.name}`);

          return (
            <div key={idx}>
              <Link href={newPath}>{_.name}</Link>
            </div>
          );
        }
      )}
    </div>
  );
};

export default GroupView;
