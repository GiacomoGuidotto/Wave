import React from "react";

type Props = {
  children: React.ReactChild;
};

const HomeLayout: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default HomeLayout;
