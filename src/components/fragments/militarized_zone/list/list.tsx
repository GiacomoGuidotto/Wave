import React from "react";
import { Categories } from "globals/globals_types";

type Props = {
  onMenuToggle: () => void; // used only on large screens
  onChatSelected: (chatSelected: string) => void;
  category: Categories;
  // changed by the menu fragment, only on large screens,
  // an internal nav bar is used on small screens
};

const List: React.FC<Props> = () => {
  // fetch contacts default, groups elsewhere
  return <>list works!</>;
};

export default List;
