// noinspection HtmlRequiredTitleElement

import React, { useEffect } from "react";
import { useReduxSelector } from "../../../store/hooks";
import { retrieveTheme, updateTheme } from "../../../store/slices/user";
import Head from "next/head";
import { useDispatch } from "react-redux";

type Props = {
  children: React.ReactChild;
};

const Layout: React.FC<Props> = ({ children }) => {
  const storeTheme = useReduxSelector(retrieveTheme);
  const dispatch = useDispatch();

  // initialize the theme from the session storage value
  useEffect(() => {
    if (sessionStorage.getItem("theme") === "light") {
      if (storeTheme === "D") dispatch(updateTheme("L"));
    } else {
      if (storeTheme === "L") dispatch(updateTheme("D"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update theme on store change
  useEffect(() => {
    if (
      storeTheme === "D" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      sessionStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      sessionStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [storeTheme]);

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
