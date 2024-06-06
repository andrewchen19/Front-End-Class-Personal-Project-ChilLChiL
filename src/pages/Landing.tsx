import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { splitStringUsingRegex, reviews } from "../utils";
import { Velocity, VideoContainer } from "../components";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError === true;
};
interface RegisterResponse {
  msg: string;
}

import coverImage from "../assets/images/landing-cover.jpg";
import grid1Image from "../assets/images/landing-grid1.jpg";
import grid2Image from "../assets/images/landing-grid2.jpg";
import spinText from "../assets/icons/spin-text.svg";
import surfVan from "../assets/lotties/surf-van.json";
import logoRed from "../assets/logos/logo-red.png";

// lottie-react
import Lottie from "lottie-react";

// shadcn
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// react icons
import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";

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
const delayVideoVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 1.5 } },
};
const delayTopVariant: Variants = {
  hidden: { opacity: 0, y: "-30px" },
  visible: { opacity: 1, y: 0, transition: { delay: 3, duration: 1.5 } },
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
const delayBottomVariant: Variants = {
  hidden: { opacity: 0, y: "30px" },
  visible: { opacity: 1, y: 0, transition: { delay: 1.2, duration: 1.5 } },
};
const left2Variant: Variants = {
  hidden: { opacity: 0, x: "-7vw" },
  visible: { opacity: 1, x: 0, transition: { duration: 2 } },
};
const right2Variant: Variants = {
  hidden: { opacity: 0, x: "7vw" },
  visible: { opacity: 1, x: 0, transition: { duration: 2 } },
};
const topVariant: Variants = {
  hidden: { opacity: 0, y: "-10vh" },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 1.8 } },
};
const spinnerCenterVariant: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0.2, duration: 2, delay: 1.25 },
  },
};
const leftVanVariant: Variants = {
  hidden: { opacity: 0, x: "-80px" },
  visible: { opacity: 1, x: 0, transition: { duration: 2, delay: 1.25 } },
};

const Landing: React.FC = () => {
  const headingChars = splitStringUsingRegex(headingText);
  const contentChars = splitStringUsingRegex(contentText);
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const registerHandler = async () => {
    if (!email) {
      toast.error("Please provide your email 😵");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://chill-server.onrender.com/register",
        {
          email,
        },
      );
      const successMessage =
        response?.data?.msg || "Registration successful. Email sent.";
      toast.success(`${successMessage} 😎`);
      setEmail("");
    } catch (error) {
      console.log(error);

      let errorMessage = "Unexpected Error. Please try again later.";

      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data as RegisterResponse;
        errorMessage = responseData.msg || errorMessage;
      }

      toast.error(`${errorMessage} 😵`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop <= 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* scroll bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[900] h-[5px] origin-left bg-pink-red"
        style={{ scaleX }}
      />

      {/* logo */}
      <div
        className={`absolute left-1/2 top-[25px] z-[1000] -translate-x-1/2 font-superglue text-[23px] tracking-widest text-red transition-opacity duration-300 md:left-[100px] md:top-[20px] md:-translate-x-0 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img src={logoRed} alt="logo" className="h-10 w-20 sm:h-12 sm:w-24" />
      </div>

      {/* banner */}
      <section className="relative h-screen w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={delayVideoVariant}
          viewport={{ once: true }}
          className="h-full w-full"
        >
          <VideoContainer />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="flex flex-col gap-8 text-center font-veneer text-7xl text-white sm:text-8xl">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              variants={leftVariant}
              viewport={{ once: true }}
            >
              We <span className="text-clay-yellow">eat</span>
            </motion.h1>
            <motion.h1
              initial="hidden"
              whileInView="visible"
              variants={rightVariant}
              viewport={{ once: true }}
            >
              We <span className="text-green-fluorescent">live</span>
            </motion.h1>
            <motion.h1
              initial="hidden"
              whileInView="visible"
              variants={centerVariant}
              viewport={{ once: true }}
              className="ml-2 sm:ml-4"
            >
              We <span className="text-pink">surf</span>
            </motion.h1>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={delayTopVariant}
            viewport={{ once: true }}
            className="absolute bottom-[30px] flex flex-col items-center overflow-visible font-helvetica text-lg font-semibold uppercase tracking-wide md:left-[100px]"
          >
            Scroll down
            <FaChevronDown className="mt-1 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* picture */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <img
            loading="lazy"
            src={coverImage}
            alt="cover-image"
            className="absolute inset-0 z-[0] h-full w-full object-cover object-center"
          />

          <Velocity baseVelocity={2}>
            Expertly curate your next adventure.
          </Velocity>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
          <Link to="/foreign-spots">
            <button className="button-74">Get Inspired</button>
          </Link>
        </div>
      </section>

      {/* intro */}
      <section className="relative bg-white">
        <div className="relative mx-auto w-[90%] max-w-4xl py-40">
          {/* title & text */}
          <div className="flex flex-col">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.1 }}
              viewport={{ once: true, amount: 0.1 }}
              className="text-center font-veneer text-5xl font-bold tracking-wide sm:text-6xl"
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
              className="mx-auto mt-8 max-w-[580px] text-center leading-7 tracking-wide text-gray-500"
            >
              {contentChars.map((char, index) => {
                return (
                  <motion.span
                    key={index}
                    variants={charVariants}
                    className={`${index >= 160 && index <= 178 ? "font-bold text-pink" : ""}`}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </motion.p>
          </div>

          {/* spinner circle */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={spinnerCenterVariant}
            viewport={{ once: true, amount: 0.1 }}
            className="absolute -right-[95px] z-[2] hidden lg:top-0 lg:block"
          >
            <img
              src={spinText}
              alt="spin-text"
              className="animate-spin-slow text-turquoise lg:h-[220px] lg:w-[330px]"
            />
          </motion.div>

          {/* vans */}
          <div className="absolute -bottom-7 left-1/2 z-[2] -translate-x-1/2 lg:left-0 lg:-translate-x-1/3">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={leftVanVariant}
              viewport={{ once: true, amount: 0.1 }}
              className="h-[150px] w-[180px] md:h-[180px] md:w-[200px] lg:h-[200px] lg:w-[230px]"
            >
              <Lottie animationData={surfVan} loop={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* grid */}
      <section>
        <div className="flex h-auto flex-col sm:flex-row">
          <div className="flex basis-1/2">
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

          <div className="-order-1 flex basis-1/2 items-center justify-center bg-beige sm:order-1 sm:py-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={bottomVariant}
              viewport={{ once: true, amount: 0.1 }}
              className="flex h-[100vw] flex-col items-center justify-center text-center sm:h-auto"
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
        </div>

        <div className="flex h-auto flex-col sm:flex-row">
          <div className="flex basis-1/2 items-center justify-center bg-beige sm:py-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={bottomVariant}
              viewport={{ once: true, amount: 0.1 }}
              className="flex h-[100vw] flex-col items-center justify-center text-center sm:h-auto"
            >
              <h3 className="font-palanquin text-3xl font-semibold">
                Story sharing
              </h3>
              <p className="mt-6 max-w-[330px]  text-gray-600">
                Increasing your knowledge of surfing, marine conservation,
                environmental issues, and related topics is our top priority.
              </p>
            </motion.div>
          </div>
          <div className="flex basis-1/2">
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
        </div>
      </section>

      {/* user reviews */}
      <section>
        <div className="mx-auto flex w-[90%] max-w-5xl flex-col py-40">
          <h3 className="text-center font-veneer text-5xl font-bold capitalize sm:text-6xl">
            What Our <span className="text-clay-yellow">Users</span> Say?
          </h3>
          <p className="ext-gray-700 mx-auto mt-6 max-w-lg text-center sm:text-xl">
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
                    <FaStar className="h-[24px] w-[24px] text-yellow" />
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
      <section className="relative bg-beige">
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
              type="email"
              placeholder="subscribe@email.com"
              className="ml-2 w-full bg-beige outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              size={"full"}
              disabled={isLoading}
              onClick={registerHandler}
            >
              {isLoading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : null}
              {isLoading ? "Loading" : "Sign up"}
            </Button>
          </motion.div>
        </div>

        {/* scroll to top */}
        <div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 md:left-[100px] md:translate-x-0">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={delayBottomVariant}
            viewport={{ once: true }}
            className="overflow-visible text-center font-helvetica text-lg font-semibold uppercase tracking-wide"
          >
            <a
              className="group flex flex-col items-center duration-300 hover:cursor-pointer hover:text-turquoise"
              href="#top"
            >
              <FaChevronUp className="mb-1 animate-bounce text-center" />
              Scroll To Top
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Landing;
