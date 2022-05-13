import styles from "./home_layout.module.css";
import React from "react";
import Head from "next/head";

type Props = {
  children: React.ReactChild;
};

const HomeLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Wave</title>
      </Head>
      <div className={styles.homeBox}>{children}</div>
    </>
  );
};

export default HomeLayout;
