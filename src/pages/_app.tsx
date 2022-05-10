import "../../styles/globals.css";
import type { AppProps } from "next/app";
import wrapper from "../store/store";
import { globals, GlobalsContext } from "../lib/global_consts";
import { appWithTranslation } from "next-i18next";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const WrapperApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <GlobalsContext.Provider value={globals}>
      {getLayout(<Component {...pageProps} />)}
    </GlobalsContext.Provider>
  );
};

export default wrapper.withRedux(appWithTranslation(WrapperApp));
