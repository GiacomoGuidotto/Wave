import React from "react";
import Head from "next/head";

type Props = {
  children: React.ReactChild;
};

const OfflineLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Wave | Offline</title>
      </Head>
      {children}
    </>
  );
};

export default OfflineLayout;
