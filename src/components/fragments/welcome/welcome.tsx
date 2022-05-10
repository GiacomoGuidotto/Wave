import styles from "./welcome.module.css";
import React from "react";
import { useTranslation } from "next-i18next";

type Props = {
  onGetStarted: () => void;
};

const Welcome: React.FC<Props> = ({ onGetStarted }) => {
  const { t } = useTranslation("index");
  return (
    <>
      <div className={styles.welcomeBox}>
        <div className={styles.title}>Wave</div>
        <button className={styles.getStartedButton} onClick={onGetStarted}>
          {t("getStarted")}
        </button>
      </div>
    </>
  );
};

export default Welcome;
