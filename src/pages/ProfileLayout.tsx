import { Outlet, useNavigation } from "react-router-dom";

import { ProfileNavbar } from "@/components";
import Loading from "../components/Loading";

// framer motion
import { motion } from "framer-motion";

const ProfileLayout: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <motion.main
      initial={{ opacity: 0, x: "-140px" }}
      animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="grid w-full grid-cols-[auto,1fr]"
    >
      <ProfileNavbar />
      {isLoading ? <Loading /> : <Outlet />}
    </motion.main>
  );
};

export default ProfileLayout;
