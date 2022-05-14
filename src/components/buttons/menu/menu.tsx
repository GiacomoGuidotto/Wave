import styles from "./menu.module.css";
import React from "react";

type Props = {
  onClick: () => void;
  active: boolean;
};

const MenuButton: React.FC<Props> = ({ active, onClick }) => {
  return (
    <button className={styles.menuButtonBox} onClick={onClick}>
      <div className={styles.menuButton}>
        <span
          aria-hidden={true}
          className={`${styles.menuButtonBar} ${
            active ? styles.menuButtonFirstBarActive : styles.menuButtonFirstBar
          }`}
        />
        <span
          aria-hidden={true}
          className={`${styles.menuButtonBar} ${
            active
              ? styles.menuButtonSecondBarActive
              : styles.menuButtonSecondBar
          }`}
        />
        <span
          aria-hidden={true}
          className={`${styles.menuButtonBar} ${
            active ? styles.menuButtonThirdBarActive : styles.menuButtonThirdBar
          }`}
        />
      </div>
    </button>
  );
};

export default MenuButton;
