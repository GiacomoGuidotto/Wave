import styles from "./list.module.css";
import React, { useState } from "react";
import { useReduxSelector } from "store/hooks";
import {
  retrieveHomeCategory,
  retrieveHomeMenu,
  updateHomeMenu,
} from "store/slices/wireframe";
import { useDispatch } from "react-redux";
import { MenuButton } from "buttons";
import Image from "next/image";
import { retrieveTheme } from "store/slices/user";

type Props = {
  onConnectionFail: () => void;
};

const List: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const menuShown = useReduxSelector(retrieveHomeMenu);
  const category = useReduxSelector(retrieveHomeCategory);
  const theme = useReduxSelector(retrieveTheme);
  // const token = useReduxSelector(retrieveToken);
  
  const [chats] = useState([]);

  // useEffect(() => {
  //   retrieveList();
  // }, []);
  //
  // const retrieveList = async () => {
  //   if (!token) return;
  //
  //   const response = await getAllContacts(token);
  //
  //   if (response instanceof ErrorResponse) {
  //     await onConnectionFail();
  //     return;
  //   }
  //   const payload = await response.json();
  //
  //   // error cases
  //   switch (response.status) {
  //     case 400:
  //       logMessages(payload, "get contact");
  //       return;
  //
  //     case 401:
  //       await onConnectionFail();
  //       return;
  //
  //     case 404:
  //       return;
  //   }
  //
  //   chats = payload
  // };

  const [optionsSelected, setOptionsSelected] = useState(false);

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
          <div className={styles.searchBarText}>search</div>
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
        {chats.map((value, index) => (
          <div
            key={index}
            className={`${styles.optionChat} ${
              optionsSelected && styles.optionChatActive
            }`}
          ></div>
        ))}
        {chats.map((value, index) => (
          <div key={index} className={styles.chat}></div>
        ))}
      </div>
      <div className={styles.bottomBar}></div>
    </div>
  );
};

export default List;
