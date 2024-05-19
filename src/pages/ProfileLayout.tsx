import { Outlet } from "react-router-dom";
import { ProfileNavbar } from "@/components";

// framer motion
import { motion } from "framer-motion";

const ProfileLayout: React.FC = () => {
  return (
    <motion.main
      initial={{ opacity: 0, x: "-140px" }}
      animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="grid w-full sm:grid-cols-[auto,1fr]"
    >
      <ProfileNavbar />
      <Outlet />
    </motion.main>
  );
};

export default ProfileLayout;
