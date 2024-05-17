import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeSidebar } from "../features/user/userSlice";
import { removeUser, closeNavigation } from "../features/user/userSlice";
import { toast } from "react-toastify";

// framer motion
import { motion } from "framer-motion";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

interface MenuItemProps {
  id: number;
  title: string;
  url: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ id, title, url }) => {
  const colors = [
    "#FF008C",
    "#D309E1",
    "#9C1AFF",
    "#7700FF",
    "#4400FF",
    "#4400FF",
    "#3000b3",
  ];
  const style = { backgroundColor: `${colors[id - 1]}` };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateHandler = (url: string) => {
    dispatch(closeSidebar());
    dispatch(closeNavigation());
    navigate(url);
  };

  const logoutHandler = () => {
    dispatch(closeSidebar());
    dispatch(closeNavigation());
    dispatch(removeUser());
    navigate("/log-in");
    toast.success("Log out Successfully 😎");
  };

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex cursor-pointer list-none items-center justify-center gap-8 sm:gap-20"
    >
      {/* icon */}
      <div
        className="top-1/2 mt-0 h-7 w-7 rounded-full sm:mt-2 sm:h-10 sm:w-10"
        style={style}
      />

      {/* text */}
      {id && id <= 5 ? (
        <div
          className="my-auto mt-2 h-[50px] flex-grow rounded font-helvetica text-[30px] font-bold leading-[35px] tracking-wide text-white sm:mt-0 sm:text-[50px] sm:leading-[50px]"
          onClick={() => navigateHandler(url)}
        >
          <span className="border-b-4 border-white">{title}</span>
        </div>
      ) : id && id === 6 ? (
        <div
          className="my-auto h-[50px] flex-grow rounded font-helvetica text-[30px] font-bold leading-[35px] tracking-wide text-white sm:text-[50px] sm:leading-[50px]"
          onClick={() => navigateHandler(url)}
        >
          <span className="border-b-4 border-white">{title}</span>
        </div>
      ) : (
        <div
          className="my-auto h-[50px] flex-grow rounded font-helvetica text-[30px] font-bold leading-[35px] tracking-wide text-white sm:text-[50px] sm:leading-[50px]"
          onClick={logoutHandler}
        >
          <span className="border-b-4 border-white">{title}</span>
        </div>
      )}
    </motion.li>
  );
};

export default MenuItem;
