import styles from "./offline_layout.module.css";
import React from "react";
import Head from "next/head";
import Image from "next/image";

type Props = {
  children: React.ReactChild;
};

const OfflineLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Wave</title>
      </Head>
      <div className={styles.offlineBox}>
        <Image src="/icons/offline.png" alt="offline" width="64" height="64" />
        <div className={styles.offlineText}>{children}</div>
      </div>
    </>
  );
};

export default OfflineLayout;
