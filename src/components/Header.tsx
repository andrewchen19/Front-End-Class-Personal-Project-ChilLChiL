import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../store";
import { removeUser } from "../features/user/userSlice";
import { toast } from "react-toastify";

const Header: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(removeUser());
    toast.success("Logout Successful 😎");
    navigate("/");
  };

  return (
    <header className="flex h-14 items-center bg-black text-white">
      <div className="mx-auto flex w-[95%] items-center justify-between">
        {/* logo */}
        <NavLink to="/">
          <h1 className="font-superglue text-2xl tracking-widest text-turquoise">
            ChilLChilL
          </h1>
        </NavLink>

        <nav className="-ml-20">
          <ul className="flex gap-5 font-notosans text-base">
            <li>
              <NavLink
                to="/local-spots"
                className="hover:text-pink"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#F48080" : "",
                  };
                }}
              >
                浪點指南
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/foreign-spots"
                className="hover:text-pink"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#F48080" : "",
                  };
                }}
              >
                國外浪點
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/articles"
                className="hover:text-pink"
                style={({ isActive }) => {
                  return {
                    color: isActive ? "#F48080" : "",
                  };
                }}
              >
                所有文章
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink
                  to="/profile"
                  className="hover:text-pink"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "#F48080" : "",
                    };
                  }}
                >
                  個人頁面
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {user ? (
          <button
            className="rounded-lg bg-turquoise px-2 py-1 font-notosans text-sm text-white"
            onClick={logoutHandler}
          >
            登出
          </button>
        ) : (
          <NavLink to="/log-in">
            <button className="rounded-lg bg-turquoise px-2 py-1 font-notosans text-sm text-white">
              登入 / 註冊
            </button>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
