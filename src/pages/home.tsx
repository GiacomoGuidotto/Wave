import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { retrieveUser, updateUser } from "store/slices/user";
import { HomeLayout, Layout } from "layouts";
import { Chat, List, Menu } from "fragments";
import { getUserInformation, logMessages, poke } from "services/api_service";
import { ErrorResponse } from "models/error_response";
import { useDispatch } from "react-redux";
import { GlobalsContext } from "globals/global_consts";
import { useReduxSelector } from "store/hooks";
import { NextPageWithLayout } from "pages/_app";
import { GetServerSideProps } from "next";
import wrapper from "store/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LanguagePopup } from "../components/utilities";
import { authorizeConnection } from "services/websocket_service";
import { retrieveChannel } from "store/slices/channel";
import OfflinePopup from "../components/utilities/offline_popup";
import {
  retrieveWireframe,
  updateDismissedLanguagePopup,
  updateDismissedOfflinePopup,
} from "store/slices/wireframe";

const Home: NextPageWithLayout = () => {
  const sessionDuration = useContext(GlobalsContext).server.sessionDuration;
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useReduxSelector(retrieveUser);
  const wireframe = useReduxSelector(retrieveWireframe);
  const channel = useReduxSelector(retrieveChannel);

  const [languagePopup, setLanguagePopup] = useState(false);
  const [offlinePopup, setOfflinePopup] = useState(false);

  // ==== Initialization logic =====================================================================
  useEffect(() => {
    // check token existence
    if (user.token.length === 0) {
      router.push("/access");
      return;
    }

    // warning if language mismatch between saved and router's
    if (
      user.language.toLowerCase() !== router.locale &&
      !wireframe.dismissedLanguagePopup
    ) {
      setLanguagePopup(true);
    }

    // open and authorize websocket connection
    authorizeConnection(user.token);

    // retrieve user info
    updateUserInfo();

    // initialize poke loop
    const interval = setInterval(() => {
      updateSession();
    }, sessionDuration - 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserInfo = async () => {
    if (user.username.length === 0) return;

    const response = await getUserInformation(user.token);

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
      updateUser({
        token: user.token,
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
    const response = await poke(user.token);

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

  useEffect(() => {
    if (channel.valid) {
      dispatch(updateDismissedOfflinePopup(false));
      setOfflinePopup(false);
    } else {
      if (wireframe.dismissedOfflinePopup) return;
      setOfflinePopup(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.valid]);

  const onConnectionFail = () => router.push("/_servers_unreachable", "/home");

  // ==== Build ====================================================================================
  return (
    <>
      {languagePopup && (
        <LanguagePopup
          targetLanguage={user.language}
          onDismiss={() => {
            setLanguagePopup(false);
            dispatch(updateDismissedLanguagePopup(true));
          }}
        />
      )}
      {offlinePopup && (
        <OfflinePopup
          onDismiss={() => {
            setOfflinePopup(false);
            dispatch(updateDismissedOfflinePopup(true));
          }}
        />
      )}
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

export const getServerSideProps = wrapper.getServerSideProps(
  (): GetServerSideProps =>
    async ({ locale }) => {
      return {
        props: {
          ...(await serverSideTranslations(locale ?? "en", ["home", "common"])),
        },
      };
    }
);

export default Home;
