import styles from "./list.module.css";
import React, { useEffect, useState } from "react";
import { useReduxSelector } from "store/hooks";
import {
  retrieveHomeCategory,
  retrieveHomeMenu,
  updateHomeCategory,
  updateHomeChat,
  updateHomeMenu,
} from "store/slices/wireframe";
import { useDispatch } from "react-redux";
import { MenuButton } from "buttons";
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
  const menuShown = useReduxSelector(retrieveHomeMenu);
  const category = useReduxSelector(retrieveHomeCategory);
  const theme = useReduxSelector(retrieveTheme);
  const token = useReduxSelector(retrieveToken);
  const username = useReduxSelector(retrieveUsername);

  const [chats, setChats] = useState<Contact[] | Group[]>([]);
  const [optionsSelected, setOptionsSelected] = useState<boolean>(false);
  const [optionsChats, setOptionsChats] = useState<Contact[] | Group[]>([]);

  // ==== Logic ====================================================================================
  useEffect(() => {
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
      const optionsChats = list.filter(
        (chat) => chat.status === "Pr" && chat.username !== username
      );

      setChats(chats);
      setOptionsChats(optionsChats);
    } else if (category === "groups") {
      // save groups
      const list = payload as Group[];
      const chats = list.filter((chat) => chat.state !== "A");
      const optionsChats = list.filter((chat) => chat.state === "A");

      setOptionsChats(optionsChats);
      setChats(chats);
    } else {
      // error case
      console.error(`wrong category: ${category}`);
    }
  };

  return (
    <div className={styles.listBox}>
      <div className={styles.searchBarBox}>
        <div className={styles.menuButton}>
          <MenuButton
            onClick={() => dispatch(updateHomeMenu(!menuShown))}
            active={menuShown}
          />
        </div>
        <div className={styles.searchBar}>
          <div className={styles.searchBarText}>{t("search")}</div>
          <Image
            src={theme === "L" ? "/icons/search.png" : "/icons/search_dark.png"}
            alt="offline"
            width="16"
            height="16"
          />
        </div>
      </div>
      <div className={styles.list}>
        <div
          className={styles.option}
          onClick={() => setOptionsSelected(!optionsSelected)}
        >
          {category === "contacts" ? "pending" : "archive"}
          <div
            className={`${styles.dropdown} ${
              optionsSelected && styles.dropdownActive
            }`}
          >
            <Image
              src={
                theme === "L"
                  ? "/icons/dropdown.png"
                  : "/icons/dropdown_dark.png"
              }
              alt="offline"
              width="16"
              height="16"
            />
          </div>
        </div>
        {optionsChats.map((value, index) => (
          <div
            key={index}
            className={`${styles.optionChat} ${
              optionsSelected && styles.optionChatActive
            }`}
          >
            {category === "contacts" ? (
              <ContactItem contact={value as Contact} />
            ) : (
              <GroupItem group={value as Group} />
            )}
          </div>
        ))}
        {chats.map((value, index) => (
          <div
            key={index}
            className={styles.chat}
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
              <ContactItem contact={value as Contact} />
            ) : (
              <GroupItem group={value as Group} />
            )}
          </div>
        ))}
      </div>
      <div
        className={`${styles.bottomBar} ${
          !menuShown && styles.bottomBarHidden
        }`}
      >
        <button className={styles.bottomBarItem}>User</button>
        <button
          className={styles.bottomBarItem}
          onClick={() => dispatch(updateHomeCategory("contacts"))}
        >
          Contacts
        </button>
        <button
          className={styles.bottomBarItem}
          onClick={() => dispatch(updateHomeCategory("groups"))}
        >
          Groups
        </button>
      </div>
    </div>
  );
};

export default List;
