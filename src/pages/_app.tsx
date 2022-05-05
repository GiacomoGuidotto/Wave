import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import wrapper from "../store/store";

const WrapperApp = ({Component, pageProps}: AppProps) => <Component {...pageProps} />;

export default wrapper.withRedux(WrapperApp)
