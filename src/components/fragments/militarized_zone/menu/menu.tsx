import styles from "./menu.module.css";
import React, { useState } from "react";

const Menu: React.FC = () => {
  const [usersActive] = useState();

  return (
    <div className={styles.menuBox}>
      <div className={styles.bannerBox}>
        <div className={styles.userBanner}></div>
        {usersActive && <div className={styles.usersChoice}></div>}
      </div>
      menu works!
      <div className={styles.menu}></div>
    </div>
  );
};

export default Menu;
