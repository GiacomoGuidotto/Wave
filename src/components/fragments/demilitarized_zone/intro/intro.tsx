import styles from "./intro.module.css";
import React from "react";
import { useTranslation } from "next-i18next";

const Intro: React.FC = () => {
  const { t } = useTranslation("index");

  return <div className={styles.introBox}>{t("intro")}</div>;
};

export default Intro;
