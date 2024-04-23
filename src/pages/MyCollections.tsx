import React from "react";
import { NavLink, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import {
  ArticlesCollectionContainer,
  LocalSpotsCollectionContainer,
  ForeignSpotsCollectionContainer,
} from "../components";

const MyCollections: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-auto flex w-[90%] max-w-6xl gap-10">
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
              我的收藏
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
              我的文章
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="my-20 flex w-full flex-col gap-10 px-10">
        <ArticlesCollectionContainer />
        <LocalSpotsCollectionContainer />
        <ForeignSpotsCollectionContainer />
      </div>
    </div>
  );
};

export default MyCollections;
