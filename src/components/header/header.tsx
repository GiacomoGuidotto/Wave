import React, {useEffect, useState} from "react";
import styles from "./header.module.css"

type Props = {
  YofAppearance: number,
  children?: JSX.Element | JSX.Element[],
}

const Header: React.FC<Props> = ({YofAppearance, children}) => {
  const [hiddenFlag, setHiddenFlag] = useState(true)

  useEffect(() => {
    const onScroll = () => window.scrollY < window.innerHeight * YofAppearance ?
      setHiddenFlag(true) :
      setHiddenFlag(false)

    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [YofAppearance])

  return (
    <div className={`${styles.headerBox} ${hiddenFlag && styles.headerBoxHidden}`}>
      {children}
    </div>
  );
};

export default Header
