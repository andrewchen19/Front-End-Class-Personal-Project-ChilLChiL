import React from "react";
import { Link } from "react-router-dom";
import { splitStringUsingRegex, reviews } from "../utils";
import { Velocity } from "../components";

import coverImage from "../assets/images/landing-cover.jpg";
import grid1Image from "../assets/images/landing-grid1.jpg";
import grid2Image from "../assets/images/landing-grid2.jpg";

// react icons
import { FaChevronDown, FaStar } from "react-icons/fa";

// framer motion
import { motion, useScroll, useSpring, Variants } from "framer-motion";

const headingText = "Why choose us?";
const contentText =
  "Explore surf spots around the world with our surfing website. We not only provide information about surf spots but also aim to cultivate a lifestyle attitude – chill and confident. Here, you can relax,enjoy the environment, music, and broaden your horizons by experiencing different cultures and meeting new friends. Join us and embark on an exciting surfing journey!";

const leftVariant: Variants = {
  hidden: { x: "-20vw" },
  visible: { x: 0, transition: { duration: 3 } },
};
const rightVariant: Variants = {
  hidden: { x: "20vw" },
  visible: { x: 0, transition: { duration: 3 } },
};
const centerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 3 } },
};
const charVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const popVariant: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0.2, duration: 2 },
  },
};
const bottomVariant: Variants = {
  hidden: { y: "10vh" },
  visible: { y: 0, transition: { duration: 1.5 } },
};
const left2Variant: Variants = {
  hidden: { x: "-7vw" },
  visible: { x: 0, transition: { duration: 2 } },
};
const right2Variant: Variants = {
  hidden: { x: "7vw" },
  visible: { x: 0, transition: { duration: 2 } },
};
const topVariant: Variants = {
  hidden: { y: "-10vh" },
  visible: { y: 0, transition: { duration: 1.5 } },
};

const Landing: React.FC = () => {
  const headingChars = splitStringUsingRegex(headingText);
  const contentChars = splitStringUsingRegex(contentText);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* scroll bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[10px] origin-left bg-clay-red"
        style={{ scaleX }}
      />

      {/* banner */}
      <section
        className="relative bg-turquoise"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="-mt-20 text-center">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              variants={leftVariant}
              viewport={{ once: true }}
              className="font-veneer text-8xl text-white"
            >
              We <span className="text-clay-yellow">eat</span>
            </motion.h1>
            <motion.h1
              initial="hidden"
              whileInView="visible"
              variants={rightVariant}
              viewport={{ once: true }}
              className="font-veneer text-8xl text-white"
            >
              We <span className="text-green-fluorescent">life</span>
            </motion.h1>
            <motion.h1
              initial="hidden"
              whileInView="visible"
              variants={centerVariant}
              viewport={{ once: true }}
              className="font-veneer ml-4 text-8xl text-white"
            >
              We <span className="text-pink">surf</span>
            </motion.h1>
          </div>
        </div>

        {/* scroll down */}
        <div className="absolute bottom-[30px] left-1/2 flex -translate-x-1/2 flex-col items-center overflow-visible font-helvetica text-lg font-semibold uppercase tracking-wide text-white">
          Scroll down <FaChevronDown className="text mt-1 animate-bounce" />
        </div>
      </section>

      {/* picture */}
      <section className="relative min-h-[100vh] max-w-full overflow-hidden">
        <div className="relative flex h-screen max-w-full flex-col items-center justify-center">
          <img
            loading="lazy"
            src={coverImage}
            alt="cover-image"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />

          <Velocity baseVelocity={2}>
            Expertly curate your next adventure.
          </Velocity>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
          <Link to="/foreign-spots">
            <button className="btn-turquoise text-3xl">Get Inspired</button>
          </Link>
        </div>
      </section>

      {/* intro */}
      <section className="bg-white">
        <div className="mx-auto flex w-[90%] max-w-5xl flex-col py-40">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true, amount: 0.1 }}
            className="font-veneer text-center text-6xl font-bold tracking-wide"
          >
            {headingChars.map((char, index) => {
              return (
                <motion.span
                  key={index}
                  variants={charVariants}
                  className={`${index >= 4 && index <= 9 ? "text-pink" : ""}`}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.01 }}
            viewport={{ once: true, amount: 0.1 }}
            className="mx-auto mt-8 max-w-[580px] text-center tracking-wide text-gray-500"
          >
            {contentChars.map((char, index) => {
              return (
                <motion.span
                  key={index}
                  variants={charVariants}
                  className={`${index >= 160 && index <= 178 ? "text-navy font-bold" : ""}`}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.p>
        </div>
      </section>

      {/* grid */}
      <section className="grid h-auto grid-cols-2 grid-rows-2">
        <div>
          <motion.img
            loading="lazy"
            src={grid1Image}
            alt="grid-image"
            initial="hidden"
            whileInView="visible"
            variants={popVariant}
            viewport={{ once: true }}
          />
        </div>
        <div className="bg-beige flex items-center justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={bottomVariant}
            viewport={{ once: true, amount: 0.1 }}
            className="text-center"
          >
            <h3 className="font-palanquin text-3xl font-semibold">
              Latest Info
            </h3>
            <p className="mt-6 max-w-[330px]  text-gray-600">
              Collecting over 18 surfing spots across Taiwan, accurately
              grasping the current local wave conditions and weather.
            </p>
          </motion.div>
        </div>
        <div className="bg-beige flex items-center justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={bottomVariant}
            viewport={{ once: true, amount: 0.1 }}
            className="text-center"
          >
            <h3 className="font-palanquin text-3xl font-semibold">
              Blog sharing
            </h3>
            <p className="mt-6 max-w-[330px] text-gray-600">
              Increasing your knowledge of surfing, marine conservation,
              environmental issues, and related topics is our top priority.
            </p>
          </motion.div>
        </div>
        <div>
          <motion.img
            loading="lazy"
            src={grid2Image}
            alt="grid-image"
            initial="hidden"
            whileInView="visible"
            variants={popVariant}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* user reviews */}
      <section>
        <div className="mx-auto flex w-[90%] max-w-5xl flex-col py-40">
          <h3 className="font-veneer text-center text-6xl font-bold capitalize">
            What Our <span className="text-clay-yellow">Users</span> Say?
          </h3>
          <p className="mx-auto mt-6 max-w-lg text-center text-xl text-gray-700">
            Hear genuine stories from our satisfied users about their
            exceptional experiences with us.
          </p>

          <div className="mt-24 flex items-center justify-evenly gap-14 max-lg:flex-col">
            {reviews.map((review, index) => {
              const { imgURL, userName, rating, feedback } = review;

              return (
                <motion.article
                  initial="hidden"
                  whileInView="visible"
                  variants={index === 0 ? left2Variant : right2Variant}
                  viewport={{ once: true, amount: 0.1 }}
                  key={userName}
                  className={`flex flex-col items-center justify-center px-6 py-10 ${index === 0 ? "bg-olive" : "bg-pink"}`}
                >
                  <img
                    src={imgURL}
                    alt="user-image"
                    className="h-[120px] w-[120px] rounded-full object-center"
                  />
                  <p className="mt-6 max-w-sm text-center font-sriracha text-lg text-white">
                    {feedback}
                  </p>
                  <div className="mt-4 flex justify-start gap-2">
                    <FaStar className="text-yellow h-[24px] w-[24px]" />
                    <p className="font-semibold">({rating})</p>
                  </div>
                  <h3 className="mt-1 text-center font-palanquin text-xl font-bold">
                    {userName}
                  </h3>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* newsletter */}
      <section className="bg-beige">
        <div className="mx-auto flex w-[90%] max-w-5xl items-center justify-between gap-10 py-40 max-lg:flex-col">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            variants={topVariant}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center font-palanquin text-3xl font-bold lg:max-w-md lg:text-4xl"
          >
            Sign Up for <span className="text-turquoise">Updates</span> &
            Newsletter
          </motion.h3>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={topVariant}
            viewport={{ once: true, amount: 0.3 }}
            className="flex w-full items-center justify-between rounded-full border border-gray-500 p-2.5 lg:max-w-[40%]"
          >
            <input
              type="text"
              placeholder="subscribe@chilLchilL.com"
              className="bg-beige ml-2 outline-none"
            />
            <button className="btn btn-sm rounded-full border-none bg-turquoise capitalize text-white hover:border-transparent hover:bg-blue-dark">
              sign up
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Landing;
