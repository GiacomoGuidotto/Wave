import React from "react";
import { Group } from "models/group";

type Props = {
  group: Group;
};

const GroupItem: React.FC<Props> = ({ group }) => {
  return (
    <>
      <p>Name: {group.name}</p>
      <p>State: {group.state}</p>
    </>
  );
};

export default GroupItem;
