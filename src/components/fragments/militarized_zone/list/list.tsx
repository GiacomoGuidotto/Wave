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
  cancelContactRequest,
  getAllContacts,
  getAllGroups,
  logMessages,
  requestContact,
  respondPending,
  searchForUsers,
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

  const searchBar = useRef() as MutableRefObject<HTMLInputElement>;
  const [researchedContacts, setResearchedContacts] = useState<Contact[]>([]);

  const [dropdownChats, setDropdownChats] = useState<Contact[] | Group[]>([]);
  const [chats, setChats] = useState<Contact[] | Group[]>([]);

  // ==== Channel listener ==============================================================

  useEffect(() => {
    setActionCallback("createContact", ({ body }) => {
      const contact = body as Contact;

      if (!contact) {
        console.error("wrong [CREATE contact] channel packet");
        return;
      }

      // add the contact to the dropdown
      if (wireframe.homeCategory === "contacts") {
        setDropdownChats([contact, ...(dropdownChats as Contact[])]);
      }
    });

    setActionCallback("deleteContactStatus", ({ headers }) => {
      const username = headers?.username;
      if (!username) {
        console.error("wrong [DELETE contact/status] channel packet");
        return;
      }

      // delete the contact from the dropdown
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
          `wrong [UPDATE contact/status] channel packet: \n${
            !username ? "username not found\n" : ""
          }${!directive ? "directive not found\n" : ""}`
        );
        return;
      }

      switch (directive) {
        case "A":
        case "R":
        case "D":
          // lazy reload of the two list
          retrieveList();
          // lazy reload of the research
          if (wireframe.homeSearchOpen && searchBar.current.value !== "")
            searchContacts(searchBar.current.value);
          break;
      }
    });

    setActionCallback("updateContactInformation", ({ body }) => {
      const contact = body as Contact;
      if (!contact) {
        console.error(`wrong [UPDATE contact/information] channel packet`);
        return;
      }

      // lazy reload of the two list
      retrieveList();
      // lazy reload of the research
      if (wireframe.homeSearchOpen && searchBar.current.value !== "")
        searchContacts(searchBar.current.value);
    });

    setActionCallback("createGroup", ({ body }) => {
      const group = body as Group;
      if (!group) {
        console.error(`wrong [CREATE group] channel packet`);
        return;
      }

      // add the group to the list
      if (wireframe.homeCategory === "groups") {
        setChats([group, ...(chats as Group[])]);
      }
    });

    setActionCallback("updateGroupInformation", ({ body }) => {
      const group = body as Group;
      if (!group) {
        console.error(`wrong [UPDATE group/information] channel packet`);
        return;
      }

      // lazy reload of the two list
      retrieveList();
    });

    setActionCallback("deleteGroup", ({ headers }) => {
      const group = headers?.group;
      if (!group) {
        console.error("wrong [DELETE group] channel packet");
        return;
      }

      // delete the group from the list
      if (wireframe.homeCategory === "groups") {
        setChats((chats as Group[]).filter((chat) => chat.uuid !== group));
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

    switch (response.status) {
      // error cases
      case 400:
        logMessages(await response.json(), `get ${wireframe.homeCategory}`);
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        return;

      //safe zone
      case 200:
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
        break;
    }
  };

  // ==== Contact request logic =========================================================
  const onRequest = async (contact: Contact) => {
    const response = await requestContact(user.token, contact.username);
    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    switch (response.status) {
      // error cases
      case 400:
        logMessages(
          await response.json(),
          `create a contact request with ${contact.username}`
        );
        break;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        break;
      case 406:
        // TODO blocked case
        break;
      case 409:
        break;

      // safe zone
      case 200:
        // update the list by replacing the targeted contact with the updated one from the API
        const newContact = (await response.json()) as Contact;
        const updatedResearchedChats = researchedContacts.map((contact) =>
          contact.username === newContact.username ? newContact : contact
        );

        setResearchedContacts(updatedResearchedChats);
        break;
    }
  };

  const onCancel = async (contact: Contact) => {
    const response = await cancelContactRequest(user.token, contact.username);
    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    switch (response.status) {
      // error cases
      case 400:
        logMessages(
          await response.json(),
          `cancel a contact request with ${contact.username}`
        );
        break;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        break;
      case 406:
        // TODO blocked case
        break;
      case 409:
        break;

      // safe zone
      case 200:
        // update the targeted contact with the "Unrelated" status
        const updatedResearchedChats = researchedContacts.map(
          (researchedContact) => {
            if (researchedContact.username === contact.username) {
              researchedContact.status = "U";
            }
            return researchedContact;
          }
        );

        setResearchedContacts(updatedResearchedChats);
        break;
    }
  };

  const onAccept = async (targetedContact: Contact) => {
    if (!user.token) return;

    const response = await respondPending(
      user.token,
      targetedContact.username,
      "A"
    );

    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    switch (response.status) {
      // error cases
      case 400:
        logMessages(
          await response.json(),
          `accept pending contact: ${targetedContact.username}`
        );
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        logMessages(
          await response.json(),
          `accept pending contact: ${targetedContact.username}`
        );
        return;

      // safe zone
      case 200:
        // moving the targeted contact from the dropdown to the list
        const updatedContact = (await response.json()) as Contact;
        setChats([...(chats as Contact[]), updatedContact]);

        setDropdownChats(
          (dropdownChats as Contact[]).filter(
            (dropdownChat) => dropdownChat !== targetedContact
          )
        );
        break;
    }
  };

  const onDecline = async (targetedContact: Contact) => {
    if (!user.token) return;

    const response = await respondPending(
      user.token,
      targetedContact.username,
      "D"
    );

    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    switch (response.status) {
      // error cases
      case 400:
        logMessages(
          await response.json(),
          `decline pending contact: ${targetedContact.username}`
        );
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        logMessages(
          await response.json(),
          `decline pending contact: ${targetedContact.username}`
        );
        return;

      // safe zone
      case 200:
        // removing the targeted contact from the list
        setDropdownChats(
          (dropdownChats as Contact[]).filter(
            (dropdownChat) => dropdownChat !== targetedContact
          )
        );
        break;
    }
  };

  const onBlock = async (targetedContact: Contact) => {
    if (!user.token) return;

    const response = await respondPending(
      user.token,
      targetedContact.username,
      "B"
    );

    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    switch (response.status) {
      // error cases
      case 400:
        logMessages(
          await response.json(),
          `block pending contact: ${targetedContact.username}`
        );
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        logMessages(
          await response.json(),
          `block pending contact: ${targetedContact.username}`
        );
        return;

      // safe zone
      case 200:
        // removing the targeted contact from the list
        setDropdownChats(
          (dropdownChats as Contact[]).filter(
            (dropdownChat) => dropdownChat !== targetedContact
          )
        );
        break;
    }
  };

  // ==== Search bar logic ==============================================================

  const searchContacts = async (text: string) => {
    const contactResponse = await searchForUsers(user.token, text);
    if (contactResponse instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    switch (contactResponse.status) {
      // error cases
      case 400:
        logMessages(await contactResponse.json(), `research contacts`);
        break;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        break;

      // safe zone
      case 200:
        const contacts = (await contactResponse.json()) as Contact[];
        setResearchedContacts(contacts);
        break;
    }
  };

  useEffect(() => {
    if (wireframe.homeSearchOpen) {
      searchBar.current.focus();
    } else {
      setResearchedContacts([]);
      searchBar.current.value = "";
    }
  }, [wireframe.homeSearchOpen]);

  const onChange: ChangeEventHandler = (event) => {
    const text = (event.target as HTMLTextAreaElement).value;

    setResearchedContacts([]);

    if (!text.length) return;

    searchContacts(text);
  };

  // ==== Build =========================================================================
  // ====================================================================================
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
          {researchedContacts.map((researchedContact, index) => (
            <div key={index} className={styles.listItem}>
              <ContactItem
                onRequest={onRequest}
                onCancel={onCancel}
                contact={researchedContact}
              />
            </div>
          ))}
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
                  contact={value as Contact}
                  onAccept={onAccept}
                  onDecline={onDecline}
                  onBlock={onBlock}
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
              <ContactItem contact={value as Contact} />
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
        </button>
        <button
          className={styles.bottomBarItem}
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
        </button>
      </div>
    </div>
  );
};

export default List;
