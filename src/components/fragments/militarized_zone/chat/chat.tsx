import React, { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { useDispatch } from "react-redux";
import { useReduxSelector } from "store/hooks";
import {
  retrieveHomeChat,
  retrieveHomeMenuOpen,
  updateHomeMenuOpen,
} from "store/slices/wireframe";
import { FallbackImage, MenuBurger } from "utilities";
import { retrieveToken, retrieveUser } from "store/slices/user";
import { Group } from "models/group";
import { Contact } from "models/contact";
import { getSingleChat, isGroup, logMessages } from "services/api_service";
import { ErrorResponse } from "models/error_response";
import { useTranslation } from "next-i18next";
import Image from "next/image";

type Props = {
  onConnectionFail: () => void;
};

const Chat: React.FC<Props> = ({ onConnectionFail }) => {
  const { t } = useTranslation("home");
  const menuShown = useReduxSelector(retrieveHomeMenuOpen);
  const chat = useReduxSelector(retrieveHomeChat);
  const user = useReduxSelector(retrieveUser);
  const token = useReduxSelector(retrieveToken);
  const dispatch = useDispatch();

  // const [messages, setMessages] = useState<Message[]>();
  // const [endRange, setEndRange] = useState<Date>(new Date());
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

  // ==== Build ====================================================================================
  return (
    <>
      <div
        className={`${styles.chatBox} ${menuShown && styles.chatBoxActive}`}
        onClick={() => {
          if (menuShown) dispatch(updateHomeMenuOpen(!menuShown));
        }}
      >
        {!chat ? (
          <div className={styles.placeholder}>
            <div className={styles.placeholderBurger}>
              <MenuBurger
                onClick={() => dispatch(updateHomeMenuOpen(!menuShown))}
                active={menuShown}
              />
            </div>
            {t("chatPlaceholder")}
          </div>
        ) : (
          <>
            <div className={styles.infoBox}>
              <div className={styles.menuButton}>
                <MenuBurger
                  onClick={() => dispatch(updateHomeMenuOpen(!menuShown))}
                  active={menuShown}
                />
              </div>
              {chatInfos && (
                <div className={styles.info}>
                  <div>
                    {isGroup(chat)
                      ? (chatInfos as Group).name
                      : (chatInfos as Contact).username}
                  </div>
                  <FallbackImage
                    picture={chatInfos.picture}
                    seed={
                      isGroup(chat)
                        ? (chatInfos as Group).name
                        : (chatInfos as Contact).username
                    }
                    size={46}
                  />
                </div>
              )}
            </div>
            <div className={styles.chat}>
              <Image
                src={"/icons/wireframe/work_in_progress.png"}
                alt="work in progress"
                width={128}
                height={128}
              />
              <div>{t("workInProgress")}</div>
            </div>
            <div className={styles.writingBox}>
              <input />
              <button>
                <Image
                  src={
                    user.theme === "L"
                      ? "/icons/wireframe/image.png"
                      : "/icons/wireframe/image_dark.png"
                  }
                  alt="image"
                  width={16}
                  height={16}
                />
              </button>
              <button>
                <Image
                  src={
                    user.theme === "L"
                      ? "/icons/wireframe/send.png"
                      : "/icons/wireframe/send_dark.png"
                  }
                  alt="send"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chat;
