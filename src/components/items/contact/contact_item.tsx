import React from "react";
import { Contact } from "models/contact";

type Props = {
  contact: Contact;
};

const ContactItem: React.FC<Props> = ({ contact }) => {
  return (
    <>
      <p>Name: {contact.name}</p>
      <p>Status: {contact.status}</p>
    </>
  );
};

export default ContactItem;
