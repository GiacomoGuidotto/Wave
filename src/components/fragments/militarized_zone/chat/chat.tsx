import React from "react";
import styles from "./chat.module.css";
import { useDispatch } from "react-redux";
import { useReduxSelector } from "store/hooks";
import { retrieveHomeMenu, updateHomeMenu } from "store/slices/wireframe";
import { MenuButton } from "buttons";

// show when a chat is selected, placeholder instead
const Chat: React.FC = () => {
  const menuShown = useReduxSelector(retrieveHomeMenu);
  // const chat = useReduxSelector(retrieveHomeChat);
  const dispatch = useDispatch();

  // fetch messages from the chat, after detect if username of group uuid
  return (
    <>
      <div
        className={`${styles.chatBox} ${menuShown && styles.chatBoxActive}`}
        onClick={() => {
          if (menuShown) dispatch(updateHomeMenu(!menuShown));
        }}
      >
        <div className={styles.infoBox}>
          <div className={styles.menuButton}>
            <MenuButton
              onClick={() => dispatch(updateHomeMenu(!menuShown))}
              active={menuShown}
            />
          </div>
          <div className={styles.info}></div>
        </div>
        <div className={styles.chat}></div>
        chat works!
        <div className={styles.writingBox}></div>
      </div>
    </>
  );
};

export default Chat;
