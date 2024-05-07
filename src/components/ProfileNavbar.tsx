import React from "react";
import { NavLink } from "react-router-dom";

const ProfileNavbar: React.FC = () => {
  return (
    <div className="border-4 border-purple-bright bg-black">
      <nav className="sticky top-20 w-[150px] px-10">
        <ul className="flex flex-col gap-4 font-medium">
          <li>
            <NavLink
              to="/profile/my-info"
              className="border-b border-b-transparent text-white hover:border-b-purple-light hover:text-purple-light"
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
              className="border-b border-b-transparent text-white hover:border-b-purple-light hover:text-purple-light"
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
              className="border-b border-b-transparent text-white hover:border-b-purple-light hover:text-purple-light"
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
    </div>
  );
};

export default ProfileNavbar;
