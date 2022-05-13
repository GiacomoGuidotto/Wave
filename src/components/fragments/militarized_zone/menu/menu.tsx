import React from "react";
import { Categories } from "globals/globals_types";

type Props = {
  onMenuItemSelected: (menuItemSelected: Categories) => void;
};

// visible only on large screens
const Menu: React.FC<Props> = () => {
  return <>menu works!</>;
};

export default Menu;
