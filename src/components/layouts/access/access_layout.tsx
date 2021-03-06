import React from "react";
import Head from "next/head";
import { Header } from "fragments";
import { LanguageButton, ThemeButton } from "../../utilities";

type Props = {
  children: React.ReactChild;
};

const AccessLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Wave | Access</title>
      </Head>
      <Header>
        <ThemeButton persistent={false} />
        <LanguageButton persistent={false} />
      </Header>
      {children}
    </>
  );
};

export default AccessLayout;
