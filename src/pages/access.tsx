import { AccessLayout, AccessPage, Layout } from "../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { NextPageWithLayout } from "./_app";
import { GetServerSideProps } from "next";
import wrapper from "../store/store";
import { updateLanguage } from "../store/slices/user";

const Access: NextPageWithLayout = () => {
  const [connected, setConnected] = useState(true);

  return (
    <>
      <AccessPage login onConnectionFail={() => setConnected(false)} />
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
