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
      {children}
    </>
  );
};

export default HomeLayout;
