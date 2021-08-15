import Link from "next/link";
import styled from "styled-components";
import { PathArrow } from "./icons";

interface PathProps {
  path: string[];
  group: number;
}

const FilePathWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 4px;
  font-family: "Rubik", sans-serif;
  margin-bottom: 10px;
  font-weight: 400;
  height: 30px;
  flex: 1;
`;

const Path = styled.p`
  color: ${(props) => props.theme.textColors[2]};
  margin: 0;
  font-size: 23px;
  transition: 0.1s ease;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.textColors[1]};
  }
`;

const CurrentPath = styled.p`
  margin: 0;
  font-size: 23px;
  background: ${(props) => props.theme.gradient};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FilePath: React.FC<PathProps> = ({ path, group }) => {
  const currPath: string[] = [];

  return (
    <FilePathWrapper>
      {path.map((_: string, idx) => {
        if (idx) currPath.push(_);

        return idx != path.length - 1 ? (
          <Link
            key={idx}
            href={`/group/${group}/${
              currPath.length ? "path/" : ""
            }${currPath.join("/")}`}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Path>{_}</Path>
              <PathArrow />
            </div>
          </Link>
        ) : (
          <CurrentPath key={idx}>{_}</CurrentPath>
        );
      })}
    </FilePathWrapper>
  );
};

export { FilePath };
