import styles from "./header.module.css";
import React, { useEffect, useState } from "react";

type Props = {
  YofAppearance?: number;
  children?: JSX.Element | JSX.Element[];
};

const Header: React.FC<Props> = ({ YofAppearance = 0, children }) => {
  const [hiddenFlag, setHiddenFlag] = useState(true);

  useEffect(() => {
    if (window.scrollY >= window.innerHeight * YofAppearance)
      setHiddenFlag(false);

    const onScroll = () =>
      window.scrollY < window.innerHeight * YofAppearance
        ? setHiddenFlag(true)
        : setHiddenFlag(false);

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [YofAppearance]);

  return (
    <div
      className={`${styles.headerBox} ${hiddenFlag && styles.headerBoxHidden}`}
    >
      {children}
    </div>
  );
};

export default Header;
