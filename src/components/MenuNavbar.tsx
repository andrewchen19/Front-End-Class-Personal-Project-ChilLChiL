import React from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import MenuToggle from "./MenuToggle";
import MenuNavigation from "./MenuNavigation";

// framer motion
import { motion } from "framer-motion";
import { useDimensions } from "../utils/useDimensions";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 0px 0px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at -21px -21px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const MenuNavbar: React.FC = () => {
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  const { isSideBarOpen } = useSelector((state: IRootState) => state.user);

  return (
    <motion.nav
      initial={false}
      animate={isSideBarOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className="absolute -top-[41px] bottom-0 left-0"
    >
      <motion.div
        className={`fixed inset-0 h-full w-full bg-turquoise`}
        variants={sidebar}
      />
      <MenuToggle />
      <MenuNavigation />
    </motion.nav>
  );
};

export default MenuNavbar;
