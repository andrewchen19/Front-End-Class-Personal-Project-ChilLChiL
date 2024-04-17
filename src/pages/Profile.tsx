import React from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { NavLink, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-auto flex w-[90%] max-w-5xl gap-10">
      <nav className="mt-20 px-10">
        <ul className="flex flex-col gap-4 font-notosans text-base">
          <li className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light">
            <NavLink
              to="/profile/my-info"
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

          <li className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light">
            <NavLink
              to="/profile/my-collections"
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

          <li className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light">
            <NavLink
              to="/profile/my-articles"
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

      <div className="mt-20 px-10">
        <h2 className="font-notosans text-2xl font-bold">我的個人資訊:</h2>

        <div className="mt-10 flex items-center gap-10">
          <img
            src={user?.profile_picture}
            alt="user-image"
            className="h-32 w-32"
          />

          <div className="flex flex-col gap-5 font-notosans font-semibold">
            <h4 className="capitalize">
              姓名：<span className="pl-2 font-ppwoodland">{user?.name}</span>
            </h4>
            <p>
              信箱：
              <span className="pl-2 font-ppwoodland">{user?.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
