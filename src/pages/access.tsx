import { AccessLayout, AccessPage, Layout } from "../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { GetServerSideProps } from "next";
import wrapper from "../store/store";
import { updateLanguage } from "../store/slices/user";
import { useRouter } from "next/router";

const Access: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <AccessPage
        login
        onConnectionFail={() => router.push("/offline", "/access")}
      />
    </>
  );
};

Access.getLayout = (page) => (
  <Layout>
    <AccessLayout>{page}</AccessLayout>
  </Layout>
);

export const getServerSideProps = wrapper.getServerSideProps(
  (store): GetServerSideProps =>
    async ({ locale }) => {
      store.dispatch(updateLanguage(locale?.toUpperCase() ?? "EN"));
      return {
        props: {
          ...(await serverSideTranslations(locale ?? "en", [
            "sign_up",
            "login",
            "access",
          ])),
        },
      };
    }
);

export default Access;
