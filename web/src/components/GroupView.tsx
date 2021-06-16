import React from "react";
import { GroupGroup, GroupUsers } from "../generated/apolloComponents";

interface Props {
  group: GroupGroup;
}

const GroupView: React.FC<Props> = ({ group }) => {
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
      </div>
    </div>
  );
};

export default GroupView;
