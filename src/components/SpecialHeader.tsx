import React from "react";
import { MenuNavbar } from "../components";

const SpecialHeader: React.FC = () => {
  return (
    <header className="fixed left-5 top-10 z-[999]">
      <MenuNavbar />
    </header>
  );
};

export default SpecialHeader;
