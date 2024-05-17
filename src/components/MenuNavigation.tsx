import * as React from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import MenuItem from "./MenuItem";

// framer motion
import { motion } from "framer-motion";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemsList = [
  { id: 1, title: "首頁", url: "/" },
  { id: 2, title: "台灣浪點", url: "/local-spots" },
  { id: 3, title: "衝浪勝地", url: "/foreign-spots" },
  { id: 4, title: "浪人部落", url: "/articles" },
  { id: 5, title: "登入 / 註冊", url: "/log-in" },
  { id: 6, title: "個人頁面", url: "/profile" },
  { id: 7, title: "登出", url: "" },
];

const MenuNavigation: React.FC = () => {
  const { user, shouldNavigationOpen } = useSelector(
    (state: IRootState) => state.user,
  );

  return (
    <motion.div
      className={`fixed inset-0 top-[100px]  ${shouldNavigationOpen ? "flex justify-center" : "hidden"}`}
    >
      <motion.ul
        variants={variants}
        className="mx-auto flex h-full w-[80%] max-w-[400px] flex-col gap-4 sm:gap-7 md:gap-10"
      >
        {itemsList.map((item) => {
          if (user && item.id === 5) {
            return null;
          }
          if (!user && (item.id === 6 || item.id === 7)) {
            return null;
          }
          return <MenuItem key={item.id} {...item} />;
        })}
      </motion.ul>
    </motion.div>
  );
};

export default MenuNavigation;
