import styles from "./offline_popup.module.css";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useReduxSelector } from "store/hooks";
import { retrieveTheme } from "store/slices/user";

type Props = {
  onDismiss: () => void;
};

const OfflinePopup: React.FC<Props> = ({ onDismiss }) => {
  const theme = useReduxSelector(retrieveTheme);
  const { t } = useTranslation("home");

  const [hide, setHide] = useState(true);

  useEffect(() => {
    setTimeout(() => setHide(false), 1000);
  }, []);

  const onCancel: MouseEventHandler = (event) => {
    event.stopPropagation();
    setHide(true);
    setTimeout(() => onDismiss(), 1000);
  };

  return (
    <div
      className={`${styles.languagePopupBox} ${
        hide && styles.languagePopupBoxHidden
      }`}
    >
      <Image
        src={"/icons/wireframe/offline.png"}
        alt="offline"
        width={42}
        height={42}
      />
      <div className={styles.languagePopupText}>{t("offline")}</div>
      <button onClick={onCancel}>
        <Image
          src={
            theme === "L"
              ? "/icons/wireframe/cancel.png"
              : "/icons/wireframe/cancel_dark.png"
          }
          alt="offline"
          width={16}
          height={16}
        />
      </button>
    </div>
  );
};

export default OfflinePopup;
