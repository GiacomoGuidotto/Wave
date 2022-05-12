import { useReduxSelector } from "../store/hooks";
import { retrieveToken } from "../store/slices/user";
import { NextPageWithLayout } from "./_app";
import { HomeLayout, Layout } from "../components";

const Home: NextPageWithLayout = () => {
  const token = useReduxSelector(retrieveToken);

  return (
    <div className="w-screen h-screen flex place-content-center place-items-center">
      <div>home works!</div>
    </div>
  );
};

Home.getLayout = (page) => (
  <Layout>
    <HomeLayout>{page}</HomeLayout>
  </Layout>
);

export default Home;
