import styles from "./home_layout.module.css";
import React from "react";
import Head from "next/head";
import { useReduxSelector } from "store/hooks";
import { retrieveHomeMenuOpen } from "store/slices/wireframe";

type Props = {
  children: React.ReactChild;
};

const HomeLayout: React.FC<Props> = ({ children }) => {
  const menuShown = useReduxSelector(retrieveHomeMenuOpen);

  return (
    <>
      <Head>
        <title>Wave</title>
      </Head>
      <div
        className={`${styles.homeBox} ${menuShown && styles.homeBoxWithMenu}`}
      >
        {children}
      </div>
    </>
  );
};

export default HomeLayout;
