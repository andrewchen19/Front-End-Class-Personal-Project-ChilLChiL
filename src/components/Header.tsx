import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../store";
import { removeUser } from "../features/user/userSlice";
import { toast } from "react-toastify";
// import { MenuNavbar } from "../components";

// shadcn
import { Button } from "@/components/ui/button";

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
    <header className="flex h-14 items-center bg-gray-950 text-white">
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

        {/* buttons */}
        {user ? (
          <div className="absolute right-0">
            <Button size={"sm"} onClick={logoutHandler}>
              登出
            </Button>
          </div>
        ) : (
          <div className="absolute right-0">
            <NavLink to="/log-in">
              <Button size={"sm"}>登入 / 註冊</Button>
            </NavLink>
          </div>
        )}
      </div>

      {/* <div className="absolute z-[999]">
        <MenuNavbar />
      </div> */}
    </header>
  );
};

export default Header;
