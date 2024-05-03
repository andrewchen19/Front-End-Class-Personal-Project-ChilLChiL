import React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useDimensions } from "../utils/useDimensions";
import MenuToggle from "./MenuToggle";
import { useSelector } from "react-redux";
import { IRootState } from "../store";

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
      className={`absolute -top-[41px] bottom-0 left-0`}
    >
      <motion.div
        className={`fixed inset-0 h-full w-full bg-clay-red`}
        variants={sidebar}
      />
      <MenuToggle />
    </motion.nav>
  );
};

export default MenuNavbar;
