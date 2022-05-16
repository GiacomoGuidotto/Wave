import styles from "./menu.module.css";
import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  retrieveHomeCategory,
  retrieveHomeUsersOpen,
  updateHomeCategory,
} from "store/slices/wireframe";
import { useReduxSelector } from "store/hooks";
import Image from "next/image";
import { retrieveTheme } from "store/slices/user";

const Menu: React.FC = () => {
  const { t } = useTranslation("home");
  const dispatch = useDispatch();
  const usersActive = useReduxSelector(retrieveHomeUsersOpen);
  const category = useReduxSelector(retrieveHomeCategory);
  const theme = useReduxSelector(retrieveTheme);

  return (
    <div className={styles.menuBox}>
      <div className={styles.bannerBox}>
        <div className={styles.userBanner}></div>
        {usersActive && <div className={styles.usersChoice}></div>}
      </div>
      <div className={styles.menu}>
        <div
          className={
            styles.menuChoice +
            " " +
            (category === "groups" && styles.menuChoiceActive)
          }
          onClick={() => dispatch(updateHomeCategory("groups"))}
        >
          <Image
            src={
              theme === "L"
                ? "/icons/wireframe/groups.png"
                : "/icons/wireframe/groups_dark.png"
            }
            alt={t("groups")}
            width={24}
            height={24}
          />
          {t("groups")}
        </div>
        <div
          className={
            styles.menuChoice +
            " " +
            (category === "contacts" && styles.menuChoiceActive)
          }
          onClick={() => dispatch(updateHomeCategory("contacts"))}
        >
          <Image
            src={
              theme === "L"
                ? "/icons/wireframe/contacts.png"
                : "/icons/wireframe/contacts_dark.png"
            }
            alt={t("groups")}
            width={24}
            height={24}
          />
          {t("contacts")}
        </div>
        <div
          className={
            styles.menuChoice
            // " " +
            // (category === "contacts" && styles.menuChoiceActive)
          }
          // onClick={() => dispatch(updateHomeCategory("contacts"))}
        >
          <Image
            src={
              theme === "L"
                ? "/icons/wireframe/setting.png"
                : "/icons/wireframe/setting_dark.png"
            }
            alt={t("setting")}
            width={24}
            height={24}
          />
          {t("setting")}
        </div>
      </div>
    </div>
  );
};

export default Menu;
