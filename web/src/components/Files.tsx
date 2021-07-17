import Link from "next/link";
import React from "react";
import styled from "styled-components";
import {
  GetRepoObjectBlobInlineFragment,
  GetRepoObjectRepository,
  GetRepoObjectTreeInlineFragment,
} from "../../generated/github-apollo-components";
import CodeHighlight from "./CodeHighlight";
import { FileIcon, FolderIcon } from "./icons";

interface FilesProps {
  repoData: GetRepoObjectRepository;
  groupId: string;
  path: string;
}

const FilesWrapper = styled.div`
  box-shadow: 6px 4px 4px rgba(0, 0, 0, 0.29);
  border-radius: 10px;
  background-color: ${(props) => props.theme.secondaryBgColor};
  padding: 20px;
`;

const Item = styled.div`
  color: ${(props) => props.theme.textColors[1]};
  width: 100%;

  p {
    width: 100%;
    margin: 0;
    font-size: 18px;
    padding: 4px 10px;
  }

  :hover p {
    text-decoration: underline;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  background: ${(props) => props.theme.mainBgColor};
`;

const order = ["tree", "blob"];

const Files: React.FC<FilesProps> = ({ repoData, groupId, path }) => {
  if (!repoData.object) return null;

  if (repoData.object.__typename !== "Tree") {
    return (
      <CodeHighlight
        fileData={
          (repoData.object as GetRepoObjectBlobInlineFragment).text || ""
        }
        startNumber={1}
        path={path}
      />
    );
  }

  if (!(repoData.object as GetRepoObjectTreeInlineFragment).entries)
    return null;

  return (
    <FilesWrapper>
      {(repoData.object as GetRepoObjectTreeInlineFragment)
        .entries!.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
        .map((_, idx: number) => {
          const newPath =
            `/group/${groupId}/path` +
            (path ? `/${[path, _.name].join("/")}` : `/${_.name}`);

          return (
            <Item key={idx}>
              <Link href={newPath}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {_.type == "tree" ? <FolderIcon /> : <FileIcon />}
                  <p>{_.name}</p>
                </div>
              </Link>
              {idx !=
                (repoData.object as GetRepoObjectTreeInlineFragment).entries!
                  .length -
                  1 && <Line />}
            </Item>
          );
        })}
    </FilesWrapper>
  );
};
export default Files;
