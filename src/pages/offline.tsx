import { NextPageWithLayout } from "./_app";
import { Layout, OfflineLayout } from "../components";
import { useRouter } from "next/router";

const Offline: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <div>We cannot reach our servers</div>
      <button onClick={() => router.reload()}>Retry connection</button>
    </>
  );
};

Offline.getLayout = (page) => (
  <Layout>
    <OfflineLayout>{page}</OfflineLayout>
  </Layout>
);

export default Offline;
