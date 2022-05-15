import React, { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { useDispatch } from "react-redux";
import { useReduxSelector } from "store/hooks";
import {
  retrieveHomeChat,
  retrieveHomeMenuOpen,
  updateHomeMenuOpen,
} from "store/slices/wireframe";
import { MenuButton } from "buttons";
import { Message } from "models/message";
import { getRangeMessages, logMessages } from "services/api_service";
import { ErrorResponse } from "models/error_response";
import { retrieveToken } from "store/slices/user";

type Props = {
  onConnectionFail: () => void;
};

const Chat: React.FC<Props> = ({ onConnectionFail }) => {
  const menuShown = useReduxSelector(retrieveHomeMenuOpen);
  const chat = useReduxSelector(retrieveHomeChat);
  const token = useReduxSelector(retrieveToken);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState<Message[]>();
  const [endRange, setEndRange] = useState<Date>(new Date());

  // ==== Messages retrieve logic ==================================================================
  useEffect(() => {
    retrieveChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const retrieveChat = async () => {
    if (chat.length === 0) return;

    if (window.scrollY < window.innerHeight) {
      const startRange = new Date(endRange);
      startRange.setDate(startRange.getDate() - 1);

      const response = await getRangeMessages(
        token,
        chat,
        startRange,
        endRange
      );

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
      const payload: Message[] = await response.json();
      setMessages(payload);
      setEndRange(startRange);
    }
  };

  // ==== Build ====================================================================================
  return (
    <>
      <div
        className={`${styles.chatBox} ${menuShown && styles.chatBoxActive}`}
        onClick={() => {
          if (menuShown) dispatch(updateHomeMenuOpen(!menuShown));
        }}
      >
        <div className={styles.infoBox}>
          <div className={styles.menuButton}>
            <MenuButton
              onClick={() => dispatch(updateHomeMenuOpen(!menuShown))}
              active={menuShown}
            />
          </div>
          <div className={styles.info}></div>
        </div>
        <div className={styles.chat}>chat works!</div>
        <div className={styles.writingBox}></div>
      </div>
    </>
  );
};

export default Chat;
