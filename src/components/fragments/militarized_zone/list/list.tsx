import styles from "./list.module.css";
import React, { useEffect, useState } from "react";
import { useReduxSelector } from "store/hooks";
import {
  retrieveHomeCategory,
  retrieveHomeDropdownOpen,
  retrieveHomeMenuOpen,
  updateHomeCategory,
  updateHomeChat,
  updateHomeDropdownOpen,
  updateHomeMenuOpen,
} from "store/slices/wireframe";
import { useDispatch } from "react-redux";
import { MenuBurger } from "utilities";
import Image from "next/image";
import {
  retrieveTheme,
  retrieveToken,
  retrieveUsername,
} from "store/slices/user";
import { useTranslation } from "next-i18next";
import {
  getAllContacts,
  getAllGroups,
  logMessages,
} from "services/api_service";
import { ErrorResponse } from "models/error_response";
import { Contact } from "models/contact";
import { Group } from "models/group";
import { ContactItem, GroupItem } from "items";

type Props = {
  onConnectionFail: () => void;
};

const List: React.FC<Props> = ({ onConnectionFail }) => {
  const { t } = useTranslation("home");
  const dispatch = useDispatch();
  const menuOpen = useReduxSelector(retrieveHomeMenuOpen);
  const dropdownOpen = useReduxSelector(retrieveHomeDropdownOpen);
  const category = useReduxSelector(retrieveHomeCategory);
  const theme = useReduxSelector(retrieveTheme);
  const token = useReduxSelector(retrieveToken);
  const username = useReduxSelector(retrieveUsername);
  
  const [chats, setChats] = useState<Contact[] | Group[]>([]);
  const [dropdownChats, setDropdownChats] = useState<Contact[] | Group[]>([]);

  // ==== List retrieve logic ======================================================================
  useEffect(() => {
    setChats([]);
    setDropdownChats([]);
    retrieveList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const retrieveList = async () => {
    if (!token) return;

    const response =
      category === "contacts"
        ? await getAllContacts(token)
        : await getAllGroups(token);
    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    // error cases
    switch (response.status) {
      case 400:
        logMessages(await response.json(), `get ${category}`);
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        return;
    }

    // safe zone
    const payload = await response.json();
    if (category === "contacts") {
      // save contact
      const list = payload as Contact[];
      const chats = list.filter((chat) => chat.status === "A");
      const dropdownChats = list.filter(
        (chat) => chat.status === "Pr" && chat.username !== username
      );

      setChats(chats);
      setDropdownChats(dropdownChats);
    } else if (category === "groups") {
      // save groups
      const list = payload as Group[];
      const chats = list.filter((chat) => chat.state !== "A");
      const dropdownChats = list.filter((chat) => chat.state === "A");

      setDropdownChats(dropdownChats);
      setChats(chats);
    } else {
      // error case
      console.error(`wrong category: ${category}`);
    }
  };

  return (
    <div className={styles.listBox}>
      {/*==== Search bar ========================================================================*/}
      <div className={styles.searchBarBox}>
        <div className={styles.menuButton}>
          <MenuBurger
            onClick={() => dispatch(updateHomeMenuOpen(!menuOpen))}
            active={menuOpen}
          />
        </div>
        <div className={styles.searchBar}>
          <div className={styles.searchBarText}>{t("search")}</div>
          <Image
            src={
              theme === "L"
                ? "/icons/wireframe/search.png"
                : "/icons/wireframe/search_dark.png"
            }
            alt="offline"
            width="16"
            height="16"
          />
        </div>
      </div>
      {/*==== Placeholder =======================================================================*/}
      {chats.length === 0 && dropdownChats.length === 0 && (
        <div className={styles.placeholder}>{t("listPlaceholder")}</div>
      )}
      <div className={styles.list}>
        {/*==== Dropdown ========================================================================*/}
        {dropdownChats.length !== 0 && (
          <div
            className={styles.dropdownHeader}
            onClick={() => dispatch(updateHomeDropdownOpen(!dropdownOpen))}
          >
            {category === "contacts" ? "pending" : "archive"}
            <div
              className={`${styles.dropdownIcon} ${
                dropdownOpen && styles.dropdownIconActive
              }`}
            >
              <Image
                src={
                  theme === "L"
                    ? "/icons/wireframe/dropdown.png"
                    : "/icons/wireframe/dropdown_dark.png"
                }
                alt="offline"
                width="16"
                height="16"
              />
            </div>
          </div>
        )}
        <div
          className={`${styles.dropdownCollapse} ${
            dropdownOpen && styles.dropdownExpanse
          }`}
        >
          {dropdownChats.map((value, index) => (
            <div key={index} className={styles.listItem}>
              {category === "contacts" ? (
                <ContactItem
                  onConnectionFail={onConnectionFail}
                  contact={value as Contact}
                />
              ) : (
                <GroupItem group={value as Group} />
              )}
            </div>
          ))}
        </div>
        {/*==== List ============================================================================*/}
        {chats.map((value, index) => (
          <div
            key={index}
            className={styles.listItem}
            onClick={() =>
              dispatch(
                updateHomeChat(
                  category === "contacts"
                    ? (value as Contact).username
                    : (value as Group).uuid
                )
              )
            }
          >
            {category === "contacts" ? (
              <ContactItem
                onConnectionFail={onConnectionFail}
                contact={value as Contact}
              />
            ) : (
              <GroupItem group={value as Group} />
            )}
          </div>
        ))}
      </div>
      {/*==== Bottom bar ========================================================================*/}
      <div
        className={`${styles.bottomBar} ${!menuOpen && styles.bottomBarHidden}`}
      >
        <button className={styles.bottomBarItem}>
          <Image
            src={
              theme === "L"
                ? "/icons/wireframe/user.png"
                : "/icons/wireframe/user_dark.png"
            }
            alt={t("setting")}
            width={24}
            height={24}
          />
          {t("user")}
        </button>
        <button
          className={styles.bottomBarItem}
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
        </button>
        <button
          className={styles.bottomBarItem}
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
        </button>
      </div>
    </div>
  );
};

export default List;
