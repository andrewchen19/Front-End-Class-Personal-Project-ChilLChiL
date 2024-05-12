import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

import { Header, Footer } from "../components";

const Layout: React.FC = () => {
  return (
    <>
      <ScrollRestoration />
      <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Layout;
