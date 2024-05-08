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
    <div className="relative z-20 bg-gray-950 pt-24">
      <nav className="sticky top-24 w-[140px]">
        <ul className="flex flex-col gap-6 font-medium">
          {profileNavbarList.map((item, index: number) => {
            return (
              <li
                key={index}
                className="flex items-center justify-center gap-3"
              >
                <motion.div {...framerIcon}>{item.icon}</motion.div>

                <NavLink
                  to={item.href}
                  className="border-b border-b-transparent text-white hover:border-b-purple-light hover:text-purple-light"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "#968095" : "",
                      borderBottom: isActive ? "1px solid #968095" : "",
                    };
                  }}
                >
                  <motion.span {...framerText(index)}>{item.title}</motion.span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default ProfileNavbar;
