import React from "react";
import { NavLink } from "react-router-dom";

const MyCollections: React.FC = () => {
  return (
    <div className="mx-auto flex w-[90%] max-w-6xl gap-10">
      <nav className="mt-20 w-[150px] shrink-0 px-10">
        <ul className="flex flex-col gap-4 font-notosans text-base">
          <li>
            <NavLink
              to="/profile/my-info"
              className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light"
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
              className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#968095" : "",
                  borderBottom: isActive ? "1px solid #968095" : "",
                };
              }}
            >
              我的收藏
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile/my-articles"
              className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#968095" : "",
                  borderBottom: isActive ? "1px solid #968095" : "",
                };
              }}
            >
              我的文章
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mt-20 w-full px-10">
        <h2 className="font-notosans text-2xl font-bold">我的收藏:</h2>
      </div>
    </div>
  );
};

export default MyCollections;
