import type {NextPage} from 'next'
import Head from "next/head";
import {AccessPage, Header, Intro, LanguageButton, ThemeButton, Welcome} from "../components";
import React, {useRef} from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import wrapper from "../store/store";
import {updateLanguage} from "../store/slices/user";

const Home: NextPage = () => {
  const startRef = useRef(null)
  const scrollToRef = (ref: React.RefObject<any>) => window.scrollTo({
    top:      ref.current.offsetTop,
    behavior: "smooth"
  })

  return (
    <>
      <Head>
        <title>Wave</title>
      </Head>
      <Header YofAppearance={.75}>
        <ThemeButton persistent={false}/>
        <LanguageButton persistent={false}/>
      </Header>
      <Welcome onGetStarted={() => scrollToRef(startRef)}/>
      <div ref={startRef}>
        <Intro/>
      </div>
      <AccessPage/>
    </>
  )
}

export default Home

export const getServerSideProps = wrapper.getServerSideProps(store => async ({locale}: any) => {
  store.dispatch(updateLanguage(locale?.toUpperCase()))

  return {
    props: {
      ...(await serverSideTranslations(locale, ["index", "access", "sign_up", "login"])),
    },
  };
})

