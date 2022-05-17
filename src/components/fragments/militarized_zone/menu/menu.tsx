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
import { retrieveUser } from "store/slices/user";
import { FallbackImage } from "utilities";

const Menu: React.FC = () => {
  const { t } = useTranslation(["home", "common"]);
  const dispatch = useDispatch();
  const usersActive = useReduxSelector(retrieveHomeUsersOpen);
  const category = useReduxSelector(retrieveHomeCategory);
  const user = useReduxSelector(retrieveUser);

  return (
    <div className={styles.menuBox}>
      <div className={styles.bannerBox}>
        <div className={styles.userBanner}>
          <div className={styles.userBannerMain}>
            <div className={styles.userPicture}>
              <FallbackImage
                picture={user.picture}
                seed={user.username}
                size={90}
              />
            </div>
            <div className={styles.userUsername}>{user.username}</div>
          </div>
          <div className={styles.userBannerSecondary}>
            <div className={styles.userBannerSecondaryColumn}>
              <div className={styles.userBannerLabel}>{t("name")}</div>
              <div>
                {user.name} {user.surname}
              </div>
              <div className={styles.userBannerLabel}>{t("phone")}</div>
              <div>{user.phone}</div>
            </div>
            <div className={styles.userBannerSecondaryColumn}>
              <div className={styles.userBannerLabel}>
                {t("favouriteTheme")}
              </div>
              <div>{t(`${user.theme}`)}</div>
              <div className={styles.userBannerLabel}>
                {t("favouriteLanguage")}
              </div>
              <div>{t(`${user.language}`)}</div>
            </div>
          </div>
        </div>
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
              user.theme === "L"
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
              user.theme === "L"
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
              user.theme === "L"
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
