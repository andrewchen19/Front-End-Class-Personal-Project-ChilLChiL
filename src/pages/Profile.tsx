import React from "react";
import { NavLink, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";

const Profile: React.FC = () => {
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
        <h2 className="font-notosans text-2xl font-bold">我的個人資訊:</h2>

        <div className="mt-10 flex items-center gap-10">
          <img
            src={user.profile_picture}
            alt="user-image"
            className="h-32 w-32"
          />

          <div className="flex flex-col gap-5 font-notosans font-semibold">
            <h4 className="capitalize">
              姓名：<span className="pl-2 font-ppwoodland">{user.name}</span>
            </h4>
            <p>
              信箱：
              <span className="pl-2 font-ppwoodland">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
