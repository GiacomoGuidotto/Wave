import styles from "./language_popup.module.css";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useReduxSelector } from "store/hooks";
import { retrieveTheme, updateLanguage } from "store/slices/user";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

type Props = {
  onDismiss: () => void;
  targetLanguage: string;
};

const LanguagePopup: React.FC<Props> = ({ targetLanguage, onDismiss }) => {
  const theme = useReduxSelector(retrieveTheme);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation("common");

  const [hide, setHide] = useState(true);

  useEffect(() => {
    setTimeout(() => setHide(false), 1000);
  }, []);

  const onCancel: MouseEventHandler = (event) => {
    event.stopPropagation();
    setHide(true);
    setTimeout(() => onDismiss(), 1000);
  };

  const onAccept = () => {
    dispatch(updateLanguage(targetLanguage));

    // noinspection JSIgnoredPromiseFromCall
    router.push(router.pathname, router.pathname, {
      locale: targetLanguage.toLowerCase(),
      scroll: false,
    });
  };

  return (
    <div
      className={`${styles.languagePopupBox} ${
        hide && styles.languagePopupBoxHidden
      }`}
      onClick={onAccept}
    >
      <Image
        src={`/icons/languages/${targetLanguage}.png`}
        alt={targetLanguage}
        height={50}
        width={50}
      />
      <div className={styles.languagePopupText}>
        {t(`changeTo${targetLanguage}`)}
      </div>
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

export default LanguagePopup;
