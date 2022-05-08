import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import wrapper from "../store/store";
import {globals, GlobalsContext} from "../lib/global_consts";
import {appWithTranslation} from "next-i18next";

const WrapperApp = ({Component, pageProps}: AppProps) => {
  return <GlobalsContext.Provider value={globals}>
    <Component {...pageProps} />
  </GlobalsContext.Provider>;
};

export default wrapper.withRedux(appWithTranslation(WrapperApp))
