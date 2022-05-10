import { AccessPage, IndexLayout, Intro, Layout, Welcome } from "../components";
import React, { ReactElement, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import wrapper from "../store/store";
import { updateLanguage } from "../store/slices/user";
import { NextPageWithLayout } from "./_app";
import { GetServerSideProps } from "next";

const Index: NextPageWithLayout = () => {
  const startRef = useRef(null);
  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) =>
    window.scrollTo({
      top: ref.current?.offsetTop,
      behavior: "smooth",
    });

  const [connected, setConnected] = useState(true);

  return (
    <>
      <Welcome onGetStarted={() => scrollToRef(startRef)} />
      <div ref={startRef}>
        <Intro />
      </div>
      <AccessPage onConnectionFail={() => setConnected(false)} />
    </>
  );
};

Index.getLayout = (page: ReactElement) => (
  <Layout>
    <IndexLayout>{page}</IndexLayout>
  </Layout>
);

export const getServerSideProps = wrapper.getServerSideProps(
  (store): GetServerSideProps =>
    async ({ locale }) => {
      store.dispatch(updateLanguage(locale?.toUpperCase() ?? "EN"));

      return {
        props: {
          ...(await serverSideTranslations(locale ?? "en", [
            "index",
            "access",
            "sign_up",
            "login",
          ])),
        },
      };
    }
);

export default Index;
