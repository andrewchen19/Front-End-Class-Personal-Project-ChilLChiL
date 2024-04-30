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
      <div className="relative mx-auto flex w-[95%] items-center justify-center">
        {/* logo */}
        <div className="absolute left-0">
          <NavLink to="/">
            <h1 className="font-superglue text-3xl tracking-widest text-turquoise">
              ChilLChilL
            </h1>
          </NavLink>
        </div>

        {/* links */}
        <nav>
          <ul className="flex gap-8">
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
                台灣浪點
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
                衝浪聖地
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
                浪人隨筆
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

        {/* buttons */}
        {user ? (
          <div className="absolute right-0">
            <button
              className="btn btn-sm rounded-3xl border-transparent bg-turquoise font-bold tracking-wide text-white duration-500 hover:border-transparent  hover:bg-blue-dark"
              onClick={logoutHandler}
            >
              登出
            </button>
          </div>
        ) : (
          <div className="absolute right-0">
            <NavLink to="/log-in">
              <button className="btn btn-sm rounded-3xl border-transparent bg-turquoise font-bold tracking-wide text-white duration-500 hover:border-transparent  hover:bg-blue-dark">
                登入 / 註冊
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
