import { NextPage } from "next";
import { useReduxSelector } from "../store/hooks";
import { retrieveToken } from "../store/slices/user";

const Home: NextPage = () => {
  const token = useReduxSelector(retrieveToken);

  return (
    <div className="w-screen h-screen flex place-content-center place-items-center">
      <div>home works!</div>
    </div>
  );
};

export default Home;
