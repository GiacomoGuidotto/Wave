import React, { useEffect } from "react";
import Head from "next/head";
import { useReduxSelector } from "store/hooks";
import { retrieveTheme } from "store/slices/user";

type Props = {
  children: React.ReactChild;
};

const Layout: React.FC<Props> = ({ children }) => {
  const storeTheme = useReduxSelector(retrieveTheme);

  // update theme on store change
  useEffect(() => {
    if (
      storeTheme === "D" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [storeTheme]);

  // noinspection HtmlRequiredTitleElement
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      {children}
    </>
  );
};

export default Layout;
