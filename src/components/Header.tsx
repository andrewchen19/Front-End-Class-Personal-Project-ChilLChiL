import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="h-14 bg-black text-white flex items-center">
      <div className="w-[95%] mx-auto flex justify-between items-center">
        <NavLink to="/">
          <h1 className="text-2xl font-superglue tracking-widest text-turquoise">
            ChilLChilL
          </h1>
        </NavLink>

        <nav>
          <ul className="flex gap-2 font-notosans">
            <li>
              <NavLink to="/local-spots">浪點指南</NavLink>
            </li>
            <li>
              <NavLink to="/sign-up">註冊</NavLink>
            </li>
            <li>
              <NavLink to="/log-in">登入</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
