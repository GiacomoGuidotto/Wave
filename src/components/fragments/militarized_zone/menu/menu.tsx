import styles from "./menu.module.css";
import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  resetWireframe,
  retrieveHomeCategory,
  retrieveHomeUsersOpen,
  updateHomeCategory,
  updateHomeDropdownOpen,
  updateHomeUsersOpen,
} from "store/slices/wireframe";
import { useReduxSelector } from "store/hooks";
import Image from "next/image";
import { resetUser, retrieveUser } from "store/slices/user";
import { FallbackImage } from "utilities";
import { useRouter } from "next/router";

const Menu: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(["home", "common"]);
  const dispatch = useDispatch();
  const usersActive = useReduxSelector(retrieveHomeUsersOpen);
  const category = useReduxSelector(retrieveHomeCategory);
  const user = useReduxSelector(retrieveUser);

  return (
    <div className={styles.menuBox}>
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
            <div className={styles.userBannerLabel}>{t("favouriteTheme")}</div>
            <div>{t(`${user.theme}`)}</div>
            <div className={styles.userBannerLabel}>
              {t("favouriteLanguage")}
            </div>
            <div>{t(`${user.language}`)}</div>
          </div>
        </div>
        <div
          className={[
            styles.userBannerExtension,
            usersActive && styles.userBannerExtended,
          ].join(" ")}
        >
          <button onClick={() => dispatch(updateHomeUsersOpen(!usersActive))}>
            <Image
              className={[
                styles.dropdownIcon,
                usersActive && styles.dropdownIconActive,
              ].join(" ")}
              src={
                user.theme === "L"
                  ? "/icons/wireframe/dropdown.png"
                  : "/icons/wireframe/dropdown_dark.png"
              }
              alt={t("groups")}
              width={16}
              height={16}
            />
            <div>{t("users")}</div>
          </button>
          <button>
            <div>{t("edit")}</div>
            <Image
              src={
                user.theme === "L"
                  ? "/icons/wireframe/edit.png"
                  : "/icons/wireframe/edit_dark.png"
              }
              alt={t("edit")}
              width={16}
              height={16}
            />
          </button>
        </div>
        {usersActive && (
          <div className={styles.usersChoice}>
            <div className={styles.choicesUser}>
              <div className={styles.choicesUserPicture}>
                <FallbackImage
                  picture={user.picture}
                  seed={user.username}
                  size={32}
                />
              </div>
              <div className={styles.choicesUserUsername}>{user.username}</div>
              <div
                className={styles.choicesUserRemove}
                onClick={() => {
                  dispatch(resetWireframe());
                  dispatch(resetUser());
                  router.push("/");
                }}
              >
                <Image
                  src={
                    user.theme === "L"
                      ? "/icons/wireframe/remove.png"
                      : "/icons/wireframe/remove_dark.png"
                  }
                  alt={t("edit")}
                  width={16}
                  height={16}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.menu}>
        <div
          className={[
            styles.menuChoice,
            category === "groups" && styles.menuChoiceActive,
          ].join(" ")}
          onClick={() => {
            dispatch(updateHomeCategory("groups"));
            dispatch(updateHomeDropdownOpen(false));
          }}
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
          className={[
            styles.menuChoice,
            category === "contacts" && styles.menuChoiceActive,
          ].join(" ")}
          onClick={() => {
            dispatch(updateHomeCategory("contacts"));
            dispatch(updateHomeDropdownOpen(false));
          }}
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
        <div className={styles.menuChoice}>
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
