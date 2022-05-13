import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useReduxSelector } from "store/hooks";
import { retrieveToken } from "store/slices/user";
import { NextPageWithLayout } from "pages/_app";
import { HomeLayout, Layout } from "layouts";
import { Chat, List, Menu } from "fragments";
import { Categories } from "globals/globals_types";

const Home: NextPageWithLayout = () => {
  const token = useReduxSelector(retrieveToken);
  const router = useRouter();
  useEffect(() => {
    if (token.length === 0) {
      // noinspection JSIgnoredPromiseFromCall
      router.push("/access");
    }
  }, [router, token]);

  const [menuShown, setMenuShown] = useState<boolean>(true);
  const [menuSelected, setMenuSelected] = useState<Categories>("contacts");
  const [chatSelected, setChatSelected] = useState<string>("");

  return (
    <>
      <Menu
        onMenuItemSelected={(menuItemSelected) =>
          setMenuSelected(menuItemSelected)
        }
      />
      <List
        onMenuToggle={() => setMenuShown(!menuShown)}
        onChatSelected={(chatSelected) => setChatSelected(chatSelected)}
        category={menuSelected}
      />
      <Chat onMenuToggle={() => setMenuShown(!menuShown)} chat={chatSelected} />
    </>
  );
};

Home.getLayout = (page) => (
  <Layout>
    <HomeLayout>{page}</HomeLayout>
  </Layout>
);

export default Home;
