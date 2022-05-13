import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import wrapper from "store/store";
import { updateLanguage } from "store/slices/user";
import { NextPageWithLayout } from "pages/_app";
import { AccessLayout, Layout } from "layouts";
import { AccessPage } from "fragments";

const Access: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <AccessPage
        login
        onConnectionFail={() => router.push("/_servers_unreachable", "/access")}
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
