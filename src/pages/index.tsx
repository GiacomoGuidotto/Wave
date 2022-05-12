import { AccessPage, IndexLayout, Intro, Layout, Welcome } from "../components";
import React, { ReactElement, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import wrapper from "../store/store";
import { updateLanguage } from "../store/slices/user";
import { NextPageWithLayout } from "./_app";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

const Index: NextPageWithLayout = () => {
  const router = useRouter();
  const startRef = useRef(null);
  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) =>
    window.scrollTo({
      top: ref.current?.offsetTop,
      behavior: "smooth",
    });

  return (
    <>
      <Welcome onGetStarted={() => scrollToRef(startRef)} />
      <div ref={startRef}>
        <Intro />
      </div>
      <AccessPage onConnectionFail={() => router.push("/offline", "/")} />
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
