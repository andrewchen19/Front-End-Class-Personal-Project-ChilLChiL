import React from "react";
import { NavLink } from "react-router-dom";

const ProfileNavbar: React.FC = () => {
  return (
    <nav className="mt-20 w-[150px] shrink-0 px-10">
      <ul className="flex flex-col gap-4 font-notosans text-base">
        <li>
          <NavLink
            to="/profile/my-info"
            className="border-b border-b-transparent hover:border-b-purple-light hover:text-purple-light"
            style={({ isActive }) => {
              return {
                color: isActive ? "#968095" : "",
                borderBottom: isActive ? "1px solid #968095" : "",
              };
            }}
          >
            個人資訊
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile/my-collections"
            className="border-b border-b-transparent hover:border-b-purple-light hover:text-purple-light"
            style={({ isActive }) => {
              return {
                color: isActive ? "#968095" : "",
                borderBottom: isActive ? "1px solid #968095" : "",
              };
            }}
          >
            收藏浪點
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile/my-articles"
            className="border-b border-b-transparent hover:border-b-purple-light hover:text-purple-light"
            style={({ isActive }) => {
              return {
                color: isActive ? "#968095" : "",
                borderBottom: isActive ? "1px solid #968095" : "",
              };
            }}
          >
            文章列表
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavbar;
