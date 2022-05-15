import styles from "./contact_item.module.css";
import React from "react";
import { Contact } from "models/contact";

import Image from "next/image";
import { useReduxSelector } from "store/hooks";
import { retrieveTheme, retrieveToken } from "store/slices/user";
import { logMessages, respondPending } from "services/api_service";
import { ErrorResponse } from "models/error_response";

type Props = {
  onConnectionFail: () => void;
  contact: Contact;
};

const ContactItem: React.FC<Props> = ({ contact, onConnectionFail }) => {
  const theme = useReduxSelector(retrieveTheme);
  const token = useReduxSelector(retrieveToken);

  const onClick = async (directive: "A" | "B" | "D") => {
    if (!token) return;

    const response = await respondPending(token, contact.username, directive);

    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    // error cases
    switch (response.status) {
      case 400:
        logMessages(
          await response.json(),
          `respond pending contact: ${contact.username}`
        );
        return;

      case 401:
        await onConnectionFail();
        return;

      case 404:
        logMessages(
          await response.json(),
          `respond pending contact: ${contact.username}`
        );
        return;
    }

    // safe zone

    return;
  };

  return (
    <div className={styles.contactBox}>
      <div className={styles.contactPicture}>
        {contact.picture && (
          <Image
            src={contact.picture}
            alt={contact.username}
            height={90}
            width={90}
          />
        )}
      </div>
      <div className={styles.contactInfo}>
        <div>{contact.username}</div>
        <div>
          {contact.name} {contact.surname}
        </div>
      </div>
      {contact.status === "Pr" && (
        <div className={styles.contactAside}>
          <button onClick={() => onClick("B")}>
            <Image
              src={
                theme === "L"
                  ? "/icons/wireframe/block.png"
                  : "/icons/wireframe/block_dark.png"
              }
              alt="offline"
              width="24"
              height="24"
            />
          </button>
          <button onClick={() => onClick("D")}>
            <Image
              src={
                theme === "L"
                  ? "/icons/wireframe/cancel.png"
                  : "/icons/wireframe/cancel_dark.png"
              }
              alt="offline"
              width="24"
              height="24"
            />
          </button>
          <button onClick={() => onClick("A")}>
            <Image
              src={
                theme === "L"
                  ? "/icons/wireframe/accept.png"
                  : "/icons/wireframe/accept_dark.png"
              }
              alt="offline"
              width="24"
              height="24"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactItem;
