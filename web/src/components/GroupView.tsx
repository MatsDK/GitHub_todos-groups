import Link from "next/link";
import React from "react";
import { GroupGroup, GroupUsers } from "../../generated/apolloComponents";
import {
  GetRepoObjectBlobInlineFragment,
  GetRepoObjectRepository,
  GetRepoObjectTreeInlineFragment,
} from "../../generated/github-apollo-components";
import { PathArrow } from "./icons";

interface Props {
  group: GroupGroup;
  repoData: GetRepoObjectRepository;
  path: { groupId: string; path: string[] };
}

const GroupView: React.FC<Props> = ({
  group,
  repoData,
  path: { groupId, path },
}) => {
  return (
    <>
      <p>{group.name}</p>
      <div>
        <h2>users</h2>
        {group.users.map((user: GroupUsers, idx: number) => (
          <div style={{ display: "flex" }} key={idx}>
            <p>{user.name}</p> <p>--</p> <p>{user.email}</p>
          </div>
        ))}
        <FilePath path={[group.name, ...path]} group={parseInt(group.id)} />
        <h2>Files</h2>
        <Files groupId={groupId} path={path.join("/")} repoData={repoData} />
      </div>
    </>
  );
};

interface PathProps {
  path: string[];
  group: number;
}

const FilePath: React.FC<PathProps> = ({ path, group }) => {
  const currPaht: string[] = [];

  return (
    <>
      <h2 style={{ margin: 0 }}>Path</h2>
      <br />
      <div style={{ display: "flex" }}>
        {path.map((_: string, idx) => {
          if (idx) currPaht.push(_);

          return idx != path.length - 1 ? (
            <Link href={`/group/${group}/${currPaht.join("/")}`}>
              <div>
                {_}
                <PathArrow />
              </div>
            </Link>
          ) : (
            <b>{_}</b>
          );
        })}
      </div>
    </>
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
    <>
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
    </>
  );
};

export default GroupView;
