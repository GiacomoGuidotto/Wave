import styles from "./welcome.module.css"
import React from "react";

type Props = {
  onGetStarted: () => void
}

const Welcome: React.FC<Props> = ({onGetStarted}) => {
  return (
    <>
      <div className={styles.bannerBox}>
        <div className={styles.title}>
          Wave
        </div>
        <button className={styles.getStartedButton} onClick={onGetStarted}>
          Get started
        </button>
      </div>
    </>
  )
}

export default Welcome
