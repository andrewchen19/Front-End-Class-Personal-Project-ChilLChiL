import React from "react";
import bannerImg from "../assets/images/foreign-banner.jpg";
import {
  MonthForeignSpotsContainer,
  NewbieForeignSpotsContainer,
  TubeForeignSpotsContainer,
} from "../components";

// framer motion
import { motion, Variants } from "framer-motion";
const allVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5 },
  },
};

const ForeignSpots: React.FC = () => {
  return (
    <motion.main
      initial="hidden"
      whileInView="visible"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      variants={allVariant}
    >
      {/* banner */}
      <div className="relative h-[450px] w-full">
        <img
          src={bannerImg}
          alt="foreign-banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2">
          <h2
            className="font-dripoctober text-6xl tracking-wide text-white"
            style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
          >
            Foreign Spot
          </h2>
        </div>
        <div className="absolute left-[50%] top-[52%] -translate-x-1/2 -translate-y-1/2">
          <p className="font-dripoctober text-clay-red">
            Your next surf trip starts here
          </p>
        </div>
      </div>

      <main className="mx-auto flex w-[90%] max-w-5xl flex-col gap-16 py-14">
        <MonthForeignSpotsContainer />
        <NewbieForeignSpotsContainer />
        <TubeForeignSpotsContainer />
      </main>
    </motion.main>
  );
};

export default ForeignSpots;
