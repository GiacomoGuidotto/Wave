import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { retrieveToken, updateState } from "store/slices/user";
import { HomeLayout, Layout } from "layouts";
import { Chat, List, Menu } from "fragments";
import { getUserInformation, logMessages, poke } from "services/api_service";
import { ErrorResponse } from "models/error_response";
import { useDispatch } from "react-redux";
import { GlobalsContext } from "globals/global_consts";
import { useReduxSelector } from "store/hooks";
import { NextPageWithLayout } from "pages/_app";

const Home: NextPageWithLayout = () => {
  const sessionDuration = useContext(GlobalsContext).server.sessionDuration;
  const router = useRouter();
  const token = useReduxSelector(retrieveToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token.length === 0) {
      router.push("/access");
      return;
    }

    updateUser();

    const interval = setInterval(() => {
      updateSession();
    }, sessionDuration - 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = async () => {
    const response = await getUserInformation(token);

    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }
    const payload = await response.json();

    // error cases
    switch (response.status) {
      case 400:
        logMessages(payload, "get user");
        return;

      case 401:
        await onConnectionFail();
        return;
    }

    const { username, name, surname, picture, phone, theme, language } =
      payload;

    dispatch(
      updateState({
        token: token,
        username: username,
        name: name,
        surname: surname,
        picture: picture ?? "",
        phone: phone ?? "",
        theme: theme,
        language: language,
      })
    );
  };

  const updateSession = async () => {
    const response = await poke(token);

    if (response instanceof ErrorResponse) {
      await onConnectionFail();
      return;
    }

    // error cases
    switch (response.status) {
      case 400:
        const payload = await response.json();
        logMessages(payload, "poke");
        return;

      case 401:
        await onConnectionFail();
        return;
    }
  };

  const onConnectionFail = () => router.push("/_unreachable_servers", "/home");

  return (
    <>
      <Menu />
      <List onConnectionFail={onConnectionFail} />
      <Chat onConnectionFail={onConnectionFail} />
    </>
  );
};

Home.getLayout = (page) => (
  <Layout>
    <HomeLayout>{page}</HomeLayout>
  </Layout>
);

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store): GetServerSideProps =>
//     async ({ locale }) => {
//       store.dispatch(updateLanguage(locale?.toUpperCase() ?? "EN"));
//       return {
//         props: {
//           ...(await serverSideTranslations(locale ?? "en", ["home"])),
//         },
//       };
//     }
// );

export default Home;
