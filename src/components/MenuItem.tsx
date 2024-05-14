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
  //   const style2 = { border: `2px solid ${colors[id - 1]}` };

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
    navigate("/");
    toast.success("Log out Successfully 😎");
  };

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className=" relative flex cursor-pointer list-none items-center"
    >
      {/* icon */}
      <div
        className="absolute left-0 top-1/2 mt-2 h-10 w-10 -translate-y-1/2 rounded-full"
        style={style}
      />

      {/* text */}
      {id && id <= 5 ? (
        <div
          className="my-auto h-[50px] flex-grow rounded text-center font-helvetica text-[50px] font-bold leading-[50px] tracking-wide text-white"
          //   style={style2}
          onClick={() => navigateHandler(url)}
        >
          <span className="border-b-4 border-white">{title}</span>
        </div>
      ) : id && id === 6 ? (
        <div
          className="my-auto h-[50px] flex-grow rounded text-center font-helvetica text-[50px] font-bold leading-[50px] tracking-wide text-white"
          //   style={style2}
          onClick={() => navigateHandler(url)}
        >
          <span className="border-b-4 border-white">{title}</span>
        </div>
      ) : (
        <div
          className="my-auto h-[50px] flex-grow rounded text-center font-helvetica text-[50px] font-bold leading-[50px] tracking-wide text-white"
          //   style={style2}
          onClick={logoutHandler}
        >
          <span className="border-b-4 border-white">{title}</span>
        </div>
      )}
    </motion.li>
  );
};

export default MenuItem;
