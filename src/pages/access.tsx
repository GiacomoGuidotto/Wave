import {NextPage} from "next";
import {AccessPage, Header, LanguageButton, ThemeButton} from "../components";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React from "react";
import Head from "next/head";

const Access: NextPage = () => {
  return (
    <>
      <Head>
        <title>Wave | Access</title>
      </Head>
      <Header YofAppearance={0}>
        <ThemeButton persistent={false}/>
        <LanguageButton persistent={false}/>
      </Header>
      <AccessPage login/>
    </>
  )
}

export default Access

export const getServerSideProps = async ({locale}: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["sign_up", "login", "access"])),
    },
  };
}
