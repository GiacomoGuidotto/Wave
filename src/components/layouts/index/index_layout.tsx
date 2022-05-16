import React from "react";
import Head from "next/head";
import { Header } from "fragments";
import { LanguageButton, ThemeButton } from "utilities";

type Props = {
  children: React.ReactChild;
};

const IndexLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Wave</title>
      </Head>
      <Header YofAppearance={0.75}>
        <ThemeButton persistent={false} />
        <LanguageButton persistent={false} />
      </Header>
      {children}
    </>
  );
};

export default IndexLayout;
