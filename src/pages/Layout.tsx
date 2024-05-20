import React from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header, Footer, SpecialHeader } from "../components";

const Layout: React.FC = () => {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/" ? true : false;

  return (
    <>
      <ScrollRestoration />
      <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
        {isHomeRoute ? <SpecialHeader /> : <Header />}
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Layout;
