import "styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import wrapper from "store/store";
import { globals, GlobalsContext } from "globals/global_consts";
import { useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SplashScreen } from "fragments";
import { persistStore } from "redux-persist";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const WrapperApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  // Redux persisted storage initialization
  const persistor = persistStore(useStore());

  return (
    <PersistGate persistor={persistor} loading={<SplashScreen />}>
      <GlobalsContext.Provider value={globals}>
        {getLayout(<Component {...pageProps} />)}
      </GlobalsContext.Provider>
    </PersistGate>
  );
};

export default wrapper.withRedux(appWithTranslation(WrapperApp));
