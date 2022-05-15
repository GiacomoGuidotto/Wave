import styles from "./splash_screen.module.css";
import React from "react";
import Image from "next/image";

const SplashScreen: React.FC = () => {
  return (
    <div className={styles.splashScreenBox}>
      <Image
        src={"/icons/favicon.png"}
        alt={"Wave"}
        height={64}
        width={64}
      ></Image>
    </div>
  );
};

export default SplashScreen;
