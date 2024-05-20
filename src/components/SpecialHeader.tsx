import React from "react";
import { MenuNavbar } from "../components";

const SpecialHeader: React.FC = () => {
  return (
    <div className="fixed left-[15px] top-10 z-[999]">
      <MenuNavbar />
    </div>
  );
};

export default SpecialHeader;
