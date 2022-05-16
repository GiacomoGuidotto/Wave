import React, { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { useDispatch } from "react-redux";
import { useReduxSelector } from "store/hooks";
import {
  retrieveHomeChat,
  retrieveHomeMenuOpen,
  updateHomeMenuOpen,
} from "store/slices/wireframe";
import { MenuBurger } from "utilities";
import { Message } from "models/message";
import { retrieveToken } from "store/slices/user";
import { Group } from "models/group";
import { Contact } from "models/contact";
import { getSingleChat, isGroup, logMessages } from "services/api_service";
import { ErrorResponse } from "models/error_response";
import { useTranslation } from "next-i18next";

type Props = {
  onConnectionFail: () => void;
};

const Chat: React.FC<Props> = ({ onConnectionFail }) => {
  const { t } = useTranslation("home");
  const menuShown = useReduxSelector(retrieveHomeMenuOpen);
  const chat = useReduxSelector(retrieveHomeChat);
  const token = useReduxSelector(retrieveToken);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState<Message[]>();
  const [endRange, setEndRange] = useState<Date>(new Date());
  const [chatInfos, setChatInfos] = useState<Group | Contact>();

  // ==== Messages retrieve logic ==================================================================
  useEffect(() => {
    retrieveChatInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const retrieveChatInfo = async () => {
    if (chat.length === 0) return;
    const response = await getSingleChat(token, chat);

    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    // error cases
    switch (response.status) {
      case 400:
        logMessages(await response.json(), `get chat messages: ${chat}`);
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        return;
    }

    // safe zone
    const payload = await response.json();
    if (isGroup(chat)) {
      setChatInfos(payload as Group);
    } else {
      setChatInfos(payload as Contact);
    }
  };

  // const retrieveChat = async () => {
  //   if (chat.length === 0) return;
  //
  //   if (window.scrollY < window.innerHeight) {
  //     const startRange = new Date(endRange);
  //     startRange.setDate(startRange.getDate() - 1);
  //
  //     const response = await getRangeMessages(
  //       token,
  //       chat,
  //       startRange,
  //       endRange
  //     );
  //
  //     if (response instanceof ErrorResponse) {
  //       await onConnectionFail();
  //       return;
  //     }
  //
  //     // error cases
  //     switch (response.status) {
  //       case 400:
  //         logMessages(await response.json(), `get chat messages: ${chat}`);
  //         return;
  //
  //       case 401:
  //         await onConnectionFail();
  //         return;
  //
  //       case 404:
  //         return;
  //     }
  //
  //     // safe zone
  //     const payload: Message[] = await response.json();
  //     setMessages(payload);
  //     setEndRange(startRange);
  //   }
  // };

  // ==== Build ====================================================================================
  return (
    <>
      <div
        className={`${styles.chatBox} ${menuShown && styles.chatBoxActive}`}
        onClick={() => {
          if (menuShown) dispatch(updateHomeMenuOpen(!menuShown));
        }}
      >
        {chat.length === 0 ? (
          <div className={styles.placeholder}>{t("chatPlaceholder")}</div>
        ) : (
          <>
            <div className={styles.infoBox}>
              <div className={styles.menuButton}>
                <MenuBurger
                  onClick={() => dispatch(updateHomeMenuOpen(!menuShown))}
                  active={menuShown}
                />
              </div>
              <div className={styles.info}>
                {isGroup(chat)
                  ? (chatInfos as Group)?.name
                  : (chatInfos as Contact)?.username}
              </div>
            </div>
            <div className={styles.chat}></div>
            <div className={styles.writingBox}></div>
          </>
        )}
      </div>
    </>
  );
};

export default Chat;
