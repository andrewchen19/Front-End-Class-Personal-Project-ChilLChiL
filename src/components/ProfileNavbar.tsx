import React from "react";
import { NavLink } from "react-router-dom";
import { profileNavbarList } from "@/utils";

// framer motion
import { motion } from "framer-motion";

const ProfileNavbar: React.FC = () => {
  const framerText = (delay: number) => {
    return {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: {
        delay: 1.5 + delay / 5,
      },
    };
  };
  const framerIcon = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 20,
      delay: 2.1,
    },
  };

  return (
    <>
      {/* desktopNavbar */}
      <div
        className="relative z-[2] border-r-2 bg-white pt-24 max-md:hidden"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <nav className="sticky top-24 w-[209.7px]">
          <ul className="flex flex-col gap-6 font-medium">
            {profileNavbarList.map((item, index: number) => {
              return (
                <li key={index} className="nav-li">
                  <NavLink
                    to={item.href}
                    className="mx-auto flex w-[155.7px] items-center justify-center rounded-lg hover:bg-gray-200"
                  >
                    <button className="text-b flex h-full w-full items-center justify-between rounded-lg px-5 py-2">
                      <motion.div {...framerIcon}>{item.icon}</motion.div>
                      <motion.span {...framerText(index)}>
                        {item.title}
                      </motion.span>
                    </button>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* mobileNavbar */}
      <div className="flex h-14 items-center justify-center border-b-2 bg-white md:hidden">
        <nav className="flex w-[90%] items-center">
          <ul className="flex w-full justify-between gap-2 font-medium">
            {profileNavbarList.map((item, index: number) => {
              return (
                <li key={index} className="nav-li">
                  <NavLink
                    to={item.href}
                    className="mx-auto flex items-center justify-center rounded-lg hover:bg-gray-200"
                  >
                    <button className="text-b flex h-full w-full items-center gap-1 rounded-lg p-1 px-3 md:justify-between md:px-5 md:py-2">
                      <motion.div {...framerIcon}>{item.icon}</motion.div>
                      <motion.span
                        {...framerText(index)}
                        className="max-sm:text-sm"
                      >
                        {item.title}
                      </motion.span>
                    </button>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ProfileNavbar;
