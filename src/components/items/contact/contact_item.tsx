import styles from "./contact_item.module.css";
import React from "react";
import { Contact } from "models/contact";

import Image from "next/image";
import { useReduxSelector } from "store/hooks";
import { retrieveTheme } from "store/slices/user";
import { FallbackImage } from "utilities";

type Props = {
  onRequest?: (targetedContact: Contact) => void;
  onCancel?: (targetedContact: Contact) => void;
  onAccept?: (targetedContact: Contact) => void;
  onDecline?: (targetedContact: Contact) => void;
  onBlock?: (targetedContact: Contact) => void;
  contact: Contact;
};

const ContactItem: React.FC<Props> = ({
  contact,
  onRequest = () => {
    // request a contact
  },
  onCancel = () => {
    // cancel a contact request
  },
  onAccept = () => {
    // accept the contact request
  },
  onDecline = () => {
    // decline the contact request
  },
  onBlock = () => {
    // block the contact
  },
}) => {
  const theme = useReduxSelector(retrieveTheme);

  return (
    <div className={styles.contactBox}>
      <div className={styles.contactPicture}>
        <FallbackImage
          picture={contact.picture}
          seed={contact.username}
          size={90}
        />
      </div>
      <div className={styles.contactInfo}>
        <div>{contact.username}</div>
        <div>
          {contact.name} {contact.surname}
        </div>
      </div>
      {contact.status === "Pr" && (
        <div className={styles.contactAside}>
          <button onClick={() => onBlock(contact)}>
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
          <button onClick={() => onDecline(contact)}>
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
          <button onClick={() => onAccept(contact)}>
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
      {contact.status === "U" && (
        <div className={styles.contactAside}>
          <button onClick={() => onRequest(contact)}>
            <Image
              src={
                theme === "L"
                  ? "/icons/wireframe/add_contact.png"
                  : "/icons/wireframe/add_contact_dark.png"
              }
              alt="offline"
              width="24"
              height="24"
            />
          </button>
        </div>
      )}
      {contact.status === "Ps" && (
        <div className={styles.contactAside}>
          <button onClick={() => onCancel(contact)}>
            <Image
              src={
                theme === "L"
                  ? "/icons/wireframe/remove_contact.png"
                  : "/icons/wireframe/remove_contact_dark.png"
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
