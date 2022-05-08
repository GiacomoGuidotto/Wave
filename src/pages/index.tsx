import type {NextPage} from 'next'
import Head from "next/head";
import {Header, LanguageButton, SignUp, ThemeButton, Welcome} from "../components";
import React, {useRef} from "react";

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
        <SignUp/>
      </div>
    </>
  )
}

export default Home
