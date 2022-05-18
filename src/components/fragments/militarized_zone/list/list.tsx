import styles from "./list.module.css";
import React, {
  ChangeEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReduxSelector } from "store/hooks";
import {
  retrieveWireframe,
  updateHomeCategory,
  updateHomeChat,
  updateHomeDropdownOpen,
  updateHomeMenuOpen,
  updateHomeSearchOpen,
} from "store/slices/wireframe";
import { useDispatch } from "react-redux";
import { MenuBurger } from "utilities";
import Image from "next/image";
import { retrieveUser } from "store/slices/user";
import { useTranslation } from "next-i18next";
import {
  getAllContacts,
  getAllGroups,
  logMessages,
  searchForContacts,
} from "services/api_service";
import { ErrorResponse } from "models/error_response";
import { Contact } from "models/contact";
import { Group } from "models/group";
import { ContactItem, GroupItem } from "items";
import { setActionCallback } from "services/websocket_service";

type Props = {
  onConnectionFail: () => void;
};

const List: React.FC<Props> = ({ onConnectionFail }) => {
  const { t } = useTranslation("home");
  const dispatch = useDispatch();
  const user = useReduxSelector(retrieveUser);
  const wireframe = useReduxSelector(retrieveWireframe);

  const [chats, setChats] = useState<Contact[] | Group[]>([]);
  const [dropdownChats, setDropdownChats] = useState<Contact[] | Group[]>([]);
  const [researchedChats, setResearchedChats] = useState<(Contact | Group)[]>(
    []
  );
  const searchBar = useRef() as MutableRefObject<HTMLInputElement>;

  // ==== Channel listener ==============================================================

  useEffect(() => {
    setActionCallback("createContact", ({ body }) => {
      if (!body) {
        console.error("wrong channel packet");
        return;
      }
      if (wireframe.homeCategory === "contacts") {
        setDropdownChats([body as Contact, ...(dropdownChats as Contact[])]);
      }
    });

    setActionCallback("deleteContactStatus", ({ headers }) => {
      const username = headers?.username;
      if (!username) {
        console.error("wrong channel packet");
        return;
      }

      if (wireframe.homeCategory === "contacts") {
        setDropdownChats(
          (dropdownChats as Contact[]).filter(
            (dropdownChat) => dropdownChat.username !== username
          )
        );
      }
    });

    setActionCallback("updateContactStatus", ({ headers }) => {
      const username = headers?.username;
      const directive = headers?.directive;
      if (!username || !directive) {
        console.error(
          `wrong channel packet: \n${!username ? "username not found\n" : ""}${
            !directive ? "directive not found\n" : ""
          }`
        );
        return;
      }

      switch (directive) {
        case "A":
        case "R":
          retrieveList();
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==== List retrieve logic ===========================================================
  useEffect(() => {
    setChats([]);
    setDropdownChats([]);
    retrieveList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wireframe.homeCategory]);

  const retrieveList = async () => {
    if (!user.token) return;

    const response =
      wireframe.homeCategory === "contacts"
        ? await getAllContacts(user.token)
        : await getAllGroups(user.token);
    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    // error cases
    switch (response.status) {
      case 400:
        logMessages(await response.json(), `get ${wireframe.homeCategory}`);
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        return;
    }

    // safe zone
    const payload = await response.json();
    if (wireframe.homeCategory === "contacts") {
      // save contact
      const list = payload as Contact[];
      const chats = list.filter((chat) => chat.status === "A");
      const dropdownChats = list.filter(
        (chat) => chat.status === "Pr" && chat.username !== user.username
      );

      setChats(chats);
      setDropdownChats(dropdownChats);
    } else if (wireframe.homeCategory === "groups") {
      // save groups
      const list = payload as Group[];
      const chats = list.filter((chat) => chat.state !== "A");
      const dropdownChats = list.filter((chat) => chat.state === "A");

      setDropdownChats(dropdownChats);
      setChats(chats);
    } else {
      // error case
      console.error(`wrong category: ${wireframe.homeCategory}`);
    }
  };

  // ==== Contact request logic =========================================================

  const onAccept = (chat: Contact, newInfo: Contact) => {
    setChats([...(chats as Contact[]), newInfo]);

    setDropdownChats(
      (dropdownChats as Contact[]).filter(
        (dropdownChat) => dropdownChat !== chat
      )
    );
  };

  const onDecline = (chat: Contact) => {
    setDropdownChats(
      (dropdownChats as Contact[]).filter(
        (dropdownChat) => dropdownChat !== chat
      )
    );
  };

  const onBlock = (chat: Contact) => {
    setDropdownChats(
      (dropdownChats as Contact[]).filter(
        (dropdownChat) => dropdownChat !== chat
      )
    );
  };

  // ==== Search bar logic ==============================================================

  useEffect(() => {
    if (wireframe.homeSearchOpen) {
      searchBar.current.focus();
    } else {
      setResearchedChats([]);
      searchBar.current.value = "";
    }
  }, [wireframe.homeSearchOpen]);

  const onChange: ChangeEventHandler = async (event) => {
    const text = (event.target as HTMLTextAreaElement).value;

    if (!text.length) return;

    setResearchedChats([]);

    // find contacts
    if (text.length > 4 && text.length < 32) {
      const contactResponse = await searchForContacts(user.token, text);
      if (contactResponse instanceof ErrorResponse) {
        await onConnectionFail();
        return;
      }

      switch (contactResponse.status) {
        // safe zone
        case 200:
          // const contacts = await contactResponse.json() as Contact[];
          // setResearchedChats([...researchedChats, ...contacts]);
          const contact = (await contactResponse.json()) as Contact;
          setResearchedChats([...researchedChats, contact]);
          break;

        // error cases
        case 400:
          logMessages(await contactResponse.json(), `research contacts`);
          break;

        case 401:
          await onConnectionFail();
          return;

        case 404:
          break;
      }
    }

    // TODO find groups
    // const contactResponse = await searchForGroups(user.token, text);
    // if (contactResponse instanceof ErrorResponse) {
    //   await onConnectionFail();
    //   return;
    // }
    //
    // // error cases
    // switch (contactResponse.status) {
    //   // safe zone
    //   case 200:
    //     // const contacts = await contactResponse.json() as Contact[];
    //     // setResearchedChats([...researchedChats, ...contacts]);
    //     const group = (await contactResponse.json()) as Group;
    //     setResearchedChats([...researchedChats, group]);
    //     break;
    //
    //   // error cases
    //   case 400:
    //     logMessages(await contactResponse.json(), `research contacts`);
    //     break;
    //
    //   case 401:
    //     await onConnectionFail();
    //     return;
    //
    //   case 404:
    //     break;
    // }
  };

  // ==== Build =========================================================================
  return (
    <div className={styles.listBox}>
      {/*==== Search bar =============================================================*/}
      <div
        className={[
          styles.searchBarBox,
          wireframe.homeSearchOpen && styles.searchBarBoxActive,
        ].join(" ")}
      >
        <div className={styles.menuButton}>
          <MenuBurger
            onClick={() =>
              wireframe.homeSearchOpen
                ? dispatch(updateHomeSearchOpen(!wireframe.homeSearchOpen))
                : dispatch(updateHomeMenuOpen(!wireframe.homeMenuOpen))
            }
            active={
              wireframe.homeSearchOpen
                ? wireframe.homeSearchOpen
                : wireframe.homeMenuOpen
            }
          />
        </div>
        <div
          className={[
            styles.searchBar,
            wireframe.homeSearchOpen && styles.searchBarActive,
          ].join(" ")}
          onClick={() => dispatch(updateHomeSearchOpen(true))}
        >
          {/*<div className={styles.searchBarText}>{t("search")}</div>*/}
          <input
            ref={searchBar}
            className={styles.searchBarText}
            placeholder={t("search")}
            disabled={!wireframe.homeSearchOpen}
            onChange={onChange}
          />
          <Image
            src={
              user.theme === "L"
                ? "/icons/wireframe/search.png"
                : "/icons/wireframe/search_dark.png"
            }
            alt="offline"
            width="16"
            height="16"
          />
        </div>
        <div className={wireframe.homeSearchOpen ? styles.list : "hidden"}>
          {researchedChats.map((value, index) => {
            const isContact = "username" in value;

            return (
              <div
                key={index}
                className={styles.listItem}
                // onClick={() =>
                //   dispatch(
                //     updateHomeChat(isContact ? value.username : value.uuid)
                //   )
                // }
              >
                {isContact ? (
                  <ContactItem
                    onConnectionFail={onConnectionFail}
                    contact={value}
                  />
                ) : (
                  <GroupItem group={value} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/*==== Placeholder ============================================================*/}
      {chats.length === 0 && dropdownChats.length === 0 && (
        <div className={styles.placeholder}>{t("listPlaceholder")}</div>
      )}
      <div className={styles.list}>
        {/*==== Dropdown =============================================================*/}
        {dropdownChats.length !== 0 && (
          <div
            className={styles.dropdownHeader}
            onClick={() =>
              dispatch(updateHomeDropdownOpen(!wireframe.homeDropdownOpen))
            }
          >
            {wireframe.homeCategory === "contacts" ? "pending" : "archive"}
            <div
              className={[
                styles.dropdownIcon,
                wireframe.homeDropdownOpen && styles.dropdownIconActive,
              ].join(" ")}
            >
              <Image
                src={
                  user.theme === "L"
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
          className={[
            styles.dropdownCollapse,
            wireframe.homeDropdownOpen && styles.dropdownExpanse,
          ].join(" ")}
        >
          {dropdownChats.map((value, index) => (
            <div key={index} className={styles.listItem}>
              {wireframe.homeCategory === "contacts" ? (
                <ContactItem
                  onConnectionFail={onConnectionFail}
                  contact={value as Contact}
                  onRequestAccept={(newInfo) => {
                    onAccept(value as Contact, newInfo);
                  }}
                  onRequestDecline={() => {
                    onDecline(value as Contact);
                  }}
                  onRequestBlock={() => {
                    onBlock(value as Contact);
                  }}
                />
              ) : (
                <GroupItem group={value as Group} />
              )}
            </div>
          ))}
        </div>
        {/*==== List =================================================================*/}
        {chats.map((value, index) => (
          <div
            key={index}
            className={styles.listItem}
            onClick={() =>
              dispatch(
                updateHomeChat(
                  wireframe.homeCategory === "contacts"
                    ? (value as Contact).username
                    : (value as Group).uuid
                )
              )
            }
          >
            {wireframe.homeCategory === "contacts" ? (
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
      {/*==== Bottom bar =============================================================*/}
      <div
        className={[
          styles.bottomBar,
          !wireframe.homeMenuOpen && styles.bottomBarHidden,
        ].join(" ")}
      >
        <button className={styles.bottomBarItem}>
          <Image
            src={
              user.theme === "L"
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
              user.theme === "L"
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
              user.theme === "L"
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
