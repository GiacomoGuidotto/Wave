import { NextPageWithLayout } from "./_app";
import { Layout, OfflineLayout } from "../components";

const Offline: NextPageWithLayout = () => {
  return <>You&apos;re offline</>;
};

Offline.getLayout = (page) => (
  <Layout>
    <OfflineLayout>{page}</OfflineLayout>
  </Layout>
);

export default Offline;
