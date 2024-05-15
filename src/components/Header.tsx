import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../store";
import { removeUser } from "../features/user/userSlice";
import { toast } from "react-toastify";
import logoBlue from "../assets/logos/logo-turquoise.png";

// shadcn
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(removeUser());
    toast.success("Log out Successfully 😎");
    navigate("/log-in");
  };

  return (
    <header className="flex h-14 items-center bg-gray-950 text-white">
      <div className="relative mx-auto flex w-[95%] items-center justify-center">
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
                衝浪勝地
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
                浪人部落
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
      </div>

      {/* logo */}
      <div className="absolute left-7">
        <NavLink to="/">
          <img src={logoBlue} alt="logo" className="h-8 w-16" />
        </NavLink>
      </div>

      {/* buttons */}
      {user ? (
        <div className="absolute right-7">
          <div className="flex items-center gap-5">
            <div className="mt-1 font-fashioncountry text-base leading-4 tracking-wider">
              Aloha !! {user.name}
            </div>

            <Button size={"sm"} onClick={logoutHandler}>
              登出
            </Button>
          </div>
        </div>
      ) : (
        <div className="absolute right-7">
          <NavLink to="/log-in">
            <Button size={"sm"}>登入 / 註冊</Button>
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
