import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { Layout, OfflineLayout } from "layouts";

const _servers_unreachable: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <div>We cannot reach our servers</div>
      <button onClick={() => router.reload()}>Retry connection</button>
    </>
  );
};

_servers_unreachable.getLayout = (page) => (
  <Layout>
    <OfflineLayout>{page}</OfflineLayout>
  </Layout>
);

export default _servers_unreachable;
