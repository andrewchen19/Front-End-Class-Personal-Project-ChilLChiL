import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

import { Header, Footer } from "../components";
import Loading from "../components/Loading";

// import Loading from "../components/Loading";

const Layout: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      <ScrollToTop />
      <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
        <Header />
        {isLoading ? <Loading /> : <Outlet />}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
