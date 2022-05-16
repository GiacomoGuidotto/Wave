import React from "react";
import { Group } from "models/group";
import styles from "./group_item.module.css";
import { FallbackImage } from "utilities";

type Props = {
  group: Group;
};

const GroupItem: React.FC<Props> = ({ group }) => {
  return (
    <div className={styles.groupBox}>
      <div className={styles.groupPicture}>
        <FallbackImage picture={group.picture} seed={group.name} size={90} />
      </div>
      <div className={styles.groupInfo}>
        <div>{group.name}</div>
        <div>{group.info}</div>
      </div>
    </div>
  );
};

export default GroupItem;
