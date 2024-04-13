import React from "react";
import { Outlet, useNavigation } from "react-router-dom";

import { Header, Footer } from "../components";
import Loading from "../components/Loading";

const Layout: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      <Header />
      {isLoading ? <Loading /> : <Outlet />}
      <Footer />
    </>
  );
};

export default Layout;
