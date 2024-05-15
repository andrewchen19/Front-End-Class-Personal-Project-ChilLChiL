import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../store";
import {
  toggleSidebar,
  openNavigation,
  closeNavigation,
} from "../features/user/userSlice";

// framer motion
import { motion } from "framer-motion";

const MenuToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { isSideBarOpen } = useSelector((state: IRootState) => state.user);

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (isSideBarOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    // Ensure scrolling is re-enabled when component unmounts
    return () => {
      body.style.overflow = "auto";
    };
  }, [isSideBarOpen]);

  return (
    <button
      className="absolute left-[15px] top-[24px] grid h-[50px] w-[50px] cursor-pointer place-items-center rounded-full border-none bg-transparent outline-none"
      onClick={() => {
        if (!isSideBarOpen) {
          dispatch(toggleSidebar());
          dispatch(openNavigation());
          return;
        }
        dispatch(toggleSidebar());
        setTimeout(() => {
          dispatch(closeNavigation());
        }, 790);
      }}
    >
      <svg width="23" height="23" viewBox="0 0 23 23">
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="#FF4742"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="#FF4742"
          strokeLinecap="round"
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="#FF4742"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </button>
  );
};

export default MenuToggle;
