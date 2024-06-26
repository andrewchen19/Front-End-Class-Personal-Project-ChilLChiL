import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { WhenToScore } from "../types";
import { ReadMore, Loading } from "../components";
import { splitStringUsingRegex } from "../utils";

// react-icons & icons
import { FaQuoteLeft, FaQuoteRight, FaRegIdCard } from "react-icons/fa";
import { MdAirplaneTicket } from "react-icons/md";
import { FaWifi } from "react-icons/fa6";
import { BsCurrencyExchange } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { IoWater } from "react-icons/io5";
import { CgDanger } from "react-icons/cg";
import { MdPayment } from "react-icons/md";
import surfBoard from "../assets/icons/surfboard.svg";
import airplane from "../assets/icons/airplane.svg";
import globe from "../assets/icons/globe.svg";

// firebase
import { db } from "../main";
import { doc, getDoc, updateDoc, DocumentData } from "firebase/firestore";

// framer motion
import { motion, Variants } from "framer-motion";
const quoteVariants: Variants = {
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
const bottomVariant = (id: number): Variants => {
  return {
    hidden: { opacity: 0, y: "20px" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: id * 0.3 },
    },
  };
};

// shadcn
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

// react scroll
import { Link, Element } from "react-scroll";

const ForeignSpot: React.FC = () => {
  const { name } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [infoData, setInfoData] = useState<DocumentData | null>(null);
  const [relatedSpotData, setRelatedSpotData] = useState<DocumentData[] | []>(
    [],
  );
  const [isLike, setIsLike] = useState<boolean>(false);

  const navigate = useNavigate();

  const removeUserLikesFromFirebase = async (id: string): Promise<void> => {
    if (!name) return;
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { foreignSpotsCollection } = docSnap.data();
      const newForeignSpotsCollection = [...foreignSpotsCollection].filter(
        (item) => item !== name,
      );
      await updateDoc(userRef, {
        foreignSpotsCollection: newForeignSpotsCollection,
      });
    }
  };
  const removeSpotLikesFromFirebase = async (): Promise<void> => {
    if (!name) return;
    const foreignSpotRef = doc(db, "foreign-spots", name);
    const docSnap = await getDoc(foreignSpotRef);
    if (docSnap.exists()) {
      const { likes_amount } = docSnap.data();
      const newLikes_amount = likes_amount - 1;
      await updateDoc(foreignSpotRef, {
        likes_amount: newLikes_amount,
      });
    }
  };
  const addUserLikesToFirebase = async (id: string): Promise<void> => {
    if (!name) return;
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { foreignSpotsCollection } = docSnap.data();
      const newForeignSpotsCollection = [...foreignSpotsCollection, name];
      await updateDoc(userRef, {
        foreignSpotsCollection: newForeignSpotsCollection,
      });
    }
  };
  const addSpotLikesToFirebase = async (): Promise<void> => {
    if (!name) return;
    const foreignSpotRef = doc(db, "foreign-spots", name);
    const docSnap = await getDoc(foreignSpotRef);
    if (docSnap.exists()) {
      const { likes_amount } = docSnap.data();
      const newLikes_amount = likes_amount + 1;
      await updateDoc(foreignSpotRef, {
        likes_amount: newLikes_amount,
      });
    }
  };

  const collectionHandler = async (userId: string): Promise<void> => {
    // turn like into disLike
    if (isLike) {
      await removeUserLikesFromFirebase(userId);
      await removeSpotLikesFromFirebase();
      setIsLike(false);
      toast.info("Removed from favorites 👻");
      return;
    }

    // turn dislike into like
    if (!isLike) {
      await addUserLikesToFirebase(userId);
      await addSpotLikesToFirebase();
      setIsLike(true);
      toast.info("Added to favorites ❤️");
      return;
    }
  };
  const spotHandler = (name: string, id: string) => {
    console.log(name);
    console.log(id);
    navigate(`/foreign-spots/${name}/${id}`);
    window.location.reload();
  };

  async function checkStatus(name: string): Promise<void> {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;
      const { foreignSpotsCollection } = docSnap.data();
      if (foreignSpotsCollection.includes(name)) {
        setIsLike(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getForeignSpotInfoFromFirebase(
    name: string,
  ): Promise<DocumentData | undefined> {
    const docRef = doc(db, "foreign-spots", name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setInfoData(docSnap.data());
      return docSnap.data();
    }
  }

  async function fetchRelatedSpotsFromFirebase(
    data: DocumentData,
  ): Promise<void> {
    const chooseZones = data.otherZones;
    let newArray: DocumentData[] = [];

    for (const place of chooseZones) {
      const docRef = doc(db, "foreign-spots", place);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as DocumentData;
        newArray.push(data);
      }
    }
    setRelatedSpotData(newArray);
  }

  useEffect(() => {
    const executeFunction = async (): Promise<void> => {
      if (!name) return;

      setIsLoading(true);

      try {
        if (user) {
          await checkStatus(name);
        }
        const data = await getForeignSpotInfoFromFirebase(name);
        if (data) {
          await fetchRelatedSpotsFromFirebase(data);
        }
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };

    executeFunction();
  }, []);

  if (isLoading || !infoData || !relatedSpotData) {
    return <Loading />;
  }

  const {
    country,
    primaryColor,
    secondaryColor: spotSecondaryColor,
    spotImage,
    spotDesc,
    whenToScore,
    quote,
    travelEssentials,
    quickTips,
  } = infoData;

  const quoteChars = splitStringUsingRegex(quote.desc);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* fixed scroll section */}
      <div
        className="sticky top-0 z-50 flex h-14 items-center shadow-lg backdrop-blur"
        style={{ backgroundColor: "hsl(0 0% 100%/ 0.7)" }}
      >
        <div className="relative mx-auto flex w-[85%]">
          <nav className="h-full w-full">
            <ul className="flex justify-between sm:justify-start sm:gap-10">
              <li>
                <Link
                  to="whentosurf"
                  smooth={true}
                  spy={true}
                  duration={500}
                  offset={-96}
                  className="font-medium text-gray-500 duration-150 hover:cursor-pointer hover:font-semibold hover:text-gray-900 max-sm:text-xs"
                  activeStyle={{ fontWeight: "600", color: "#030712" }}
                >
                  When to Surf
                </Link>
              </li>

              <li>
                <Link
                  to="travelessentials"
                  smooth={true}
                  spy={true}
                  duration={500}
                  offset={-80}
                  className="font-medium text-gray-500 duration-150 hover:cursor-pointer hover:font-semibold hover:text-gray-900 max-sm:text-xs"
                  activeStyle={{ fontWeight: "600", color: "#030712" }}
                >
                  Travel Essentials
                </Link>
              </li>

              <li>
                <Link
                  to="exploreotherzones"
                  smooth={true}
                  spy={true}
                  duration={500}
                  offset={-80}
                  className="font-medium text-gray-500 duration-150 hover:cursor-pointer hover:font-semibold hover:text-gray-900 max-sm:text-xs"
                  activeStyle={{ fontWeight: "600", color: "#030712" }}
                >
                  Explore Other Zones
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div
        className="relative w-full"
        style={{ height: "calc(100vh - 112px)" }}
      >
        {/* overlay */}
        <div className="grid-cols-[auto, 1fr] absolute bottom-0 left-0 z-20 grid h-[80%] w-full bg-gradient-to-t from-black"></div>

        <img
          src={spotImage}
          alt="foreign-banner"
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute left-1/2 z-30 max-w-[900px] -translate-x-1/2 max-sm:top-1/2 max-sm:-translate-y-1/2 sm:bottom-[50px] ">
          <h2
            className="text-center font-dripoctober text-6xl uppercase leading-tight tracking-wide text-white md:text-7xl lg:text-8xl"
            style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
          >
            {country.location}
          </h2>
          <p className="mt-16 hidden font-helvetica text-base font-semibold tracking-wide text-white sm:block">
            {spotDesc}
          </p>
        </div>
      </div>

      <main className="flex flex-col gap-20 pb-24 pt-16">
        {/* breadcrumbs */}
        <div className="breadcrumbs mx-auto w-[85%] max-w-6xl text-sm text-gray-500">
          <ul>
            <li>
              <a href="/" className="underline-offset-4">
                Home
              </a>
            </li>
            <li>
              <NavLink to="/foreign-spots" className="underline-offset-4">
                Foreign Spots
              </NavLink>
            </li>
            <li className="capitalize">{country.location}</li>
          </ul>
        </div>

        {/* when to surf */}
        <Element name="whentosurf" className="mx-auto -mt-8 w-[85%] max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3 font-sriracha text-2xl font-bold sm:text-3xl">
              <img src={surfBoard} alt="image" className="h-8 w-8" />
              <h2>When To Surf</h2>
            </div>

            {user && (
              <Button
                type="button"
                variant={"purple-hipster"}
                onClick={() => collectionHandler(user.id)}
              >
                {isLike ? "Favorited" : "Add Favorite"}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-8">
            {whenToScore.map((item: WhenToScore, index: number) => {
              return (
                <div key={index}>
                  <div className="flex items-center">
                    <span
                      className={`h-[50px] w-2 rounded-lg ${item.title === "prime" ? "bg-orange-bright" : item.title === "shoulder" ? "bg-green-bright" : "bg-purple-bright"}`}
                    ></span>
                    <div className="pl-4">
                      <h4 className="font-palanquin text-lg font-bold capitalize">
                        {item.title} surf season
                      </h4>
                      <p className="font-palanquin text-sm font-semibold">
                        {item.season}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col">
                    <div className="flex text-sm max-sm:flex-col">
                      <p className="pl-6 font-helvetica tracking-wide">
                        <span className="mr-1 font-semibold">Best For:</span>
                        {item.bestFor}
                      </p>
                      <p className="pl-6 font-helvetica">
                        <span className="mr-1 font-semibold tracking-wide">
                          Crowd Factor:
                        </span>
                        {item.crowdFactor}
                      </p>
                    </div>
                    <ReadMore
                      id={index.toString()}
                      text={item.desc}
                      amountOfWords={60}
                    ></ReadMore>
                  </div>
                </div>
              );
            })}
          </div>
        </Element>

        {/* famous quote */}
        <section>
          <figure className="flex max-md:flex-col">
            <div
              className="flex h-[450px] items-center justify-center md:h-[600px] md:w-1/2"
              style={{ backgroundColor: primaryColor }}
            >
              <figcaption className="relative mx-5 my-auto max-w-[500px]">
                <FaQuoteLeft
                  className="text-2xl sm:text-3xl md:text-5xl"
                  style={{ color: spotSecondaryColor }}
                />
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  transition={{ staggerChildren: 0.06 }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="mx-auto my-5 w-[95%] text-center"
                  style={{ color: spotSecondaryColor }}
                >
                  {quoteChars.map((char, index) => {
                    return (
                      <motion.span
                        key={index}
                        variants={quoteVariants}
                        className="font-helvetica text-2xl font-bold leading-tight sm:text-3xl md:text-4xl"
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </motion.div>
                <FaQuoteRight
                  className="ml-auto text-2xl sm:text-3xl md:text-5xl"
                  style={{ color: spotSecondaryColor }}
                />

                <p
                  className="absolute -bottom-10 left-[50%] -translate-x-1/2 text-nowrap text-center font-helvetica font-bold tracking-wide"
                  style={{ color: spotSecondaryColor }}
                >
                  -&nbsp;{quote.name}
                </p>
              </figcaption>
            </div>

            <div className="h-[450px] max-md:-order-1 md:h-[600px] md:w-1/2">
              <img
                src={quote.image}
                alt="quote-image"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </figure>
        </section>

        {/* travel essentials */}
        <Element
          name="travelessentials"
          className="mx-auto w-[85%] max-w-6xl scroll-m-14"
        >
          <div className="mb-8 flex items-center gap-3 font-sriracha text-2xl font-bold sm:text-3xl">
            <img src={airplane} alt="image" className="h-8 w-8" />
            <h2>Travel Essentials</h2>
          </div>

          <div className="columns-1 gap-20 md:columns-2">
            <div className="flex flex-col gap-8">
              <div className="relative aspect-[4/3] w-full">
                <motion.img
                  loading="lazy"
                  src={travelEssentials.image}
                  alt="travel-image"
                  initial="hidden"
                  whileInView="visible"
                  variants={popVariant}
                  viewport={{ once: true }}
                  className="relative z-[3] aspect-[4/3] rounded-lg object-cover object-center"
                />

                <div
                  className="absolute left-3 top-3 z-[2] aspect-[4/3] w-full rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                ></div>
              </div>

              {/* culture */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">Culture</h4>
                <p className="mt-3 font-helvetica text-gray-500 max-sm:text-sm">
                  {travelEssentials.culture}
                </p>
              </div>

              {/* local scene */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  Local scene
                </h4>
                <p className="mt-3 font-helvetica text-gray-500 max-sm:text-sm">
                  {travelEssentials.localScene}
                </p>
              </div>

              {/* getThere */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  How to get there
                </h4>
                <p className="mt-3 font-helvetica text-gray-500 max-sm:text-sm">
                  {travelEssentials.getThere}
                </p>
              </div>

              {/* bring */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  What to bring
                </h4>
                <p className="mt-3 font-helvetica text-gray-500 max-sm:text-sm">
                  {travelEssentials.localScene}
                </p>
              </div>

              {/* leisure */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  Leisure time
                </h4>
                <p className="mt-3 font-helvetica text-gray-500 max-sm:text-sm">
                  {travelEssentials.downTime}
                </p>
              </div>
            </div>
          </div>
        </Element>

        {/* quick tips */}
        <section className="mx-auto w-[85%] max-w-6xl">
          <div
            className="rounded-xl p-10"
            style={{ backgroundColor: primaryColor }}
          >
            <h3 className="mb-10 text-center font-palanquin text-2xl font-bold text-white">
              Quick Tips
            </h3>

            <div className="grid gap-x-4 gap-y-5 text-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(0)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center"
              >
                <MdAirplaneTicket
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Travel Time
                  </h4>
                  <div className="mt-2 flex flex-col items-center max-sm:text-sm">
                    <p>
                      TPE:
                      <span className="px-1">{quickTips.traveTime.TPE}</span>
                      hrs
                    </p>
                    <p>
                      LAX:
                      <span className="px-1">{quickTips.traveTime.LAX}</span>
                      hrs
                    </p>
                    <p>
                      Heathrow:
                      <span className="px-1">
                        {quickTips.traveTime.Heathrow}
                      </span>
                      hrs
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(1)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center "
              >
                <FaWifi
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Connectivity
                  </h4>
                  <p className="mt-2 text-center max-sm:text-sm">
                    {quickTips.connectivity}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(2)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center "
              >
                <BsCurrencyExchange
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">Currency</h4>
                  <p className="mt-2 text-center max-sm:text-sm">
                    {quickTips.currency}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(3)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center"
              >
                <GiTwoCoins
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center max-sm:text-sm">
                  <h4 className="font-palanquin text-xl font-bold">
                    Avg. cost
                  </h4>
                  <div className="mt-2 flex flex-col items-center">
                    <p>
                      Lunch:
                      <span className="pl-1">{quickTips.avgCost.lunch}</span>
                    </p>
                    <p>
                      Beer:
                      <span className="pl-1">{quickTips.avgCost.beer}</span>
                    </p>
                    <p>
                      Hotel:
                      <span className="pl-1">{quickTips.avgCost.hotel}</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(4)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center"
              >
                <FaRegIdCard
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Visa Requirements
                  </h4>
                  <p className="mt-2 text-center max-sm:text-sm">
                    {quickTips.visa}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(5)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center"
              >
                <IoWater
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Drink Water Quality
                  </h4>
                  <p className="mt-2 text-center max-sm:text-sm">
                    {quickTips.waterQuality}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(6)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center"
              >
                <CgDanger
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">Hazard</h4>
                  <p className="mt-2 text-center max-sm:text-sm">
                    {quickTips.hazard}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={bottomVariant(7)}
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col items-center"
              >
                <MdPayment
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Cash & Card
                  </h4>
                  <p className="mt-2 text-center max-sm:text-sm">
                    {quickTips.cashCard}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* other zone */}
        <Element
          name="exploreotherzones"
          className="mx-auto w-[85vw] max-w-6xl"
        >
          <div className="mb-8 flex items-center gap-3 font-sriracha text-2xl font-bold sm:text-3xl">
            <img src={globe} alt="image" className="h-8 w-8" />
            <h2>Explore Other Zones</h2>
          </div>

          {isLoading && <p>loading now...</p>}

          <Carousel
            className="w-[85vw] md:w-full"
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
          >
            <CarouselContent className="ml-0 md:-ml-5">
              {!isLoading &&
                relatedSpotData &&
                relatedSpotData.length > 1 &&
                relatedSpotData.map((spot) => {
                  const { id, country, coverImage } = spot;
                  return (
                    <CarouselItem
                      key={id}
                      className="overflow-hidden pl-0 hover:cursor-pointer md:basis-1/2 md:pl-5 lg:basis-1/3"
                      onClick={() => spotHandler(country.eng, id)}
                    >
                      <Card className="border-none">
                        <CardContent className="group relative h-[420px]">
                          {/* overlay */}
                          <div className="absolute z-10 h-full w-full bg-black/15 group-hover:bg-black/50"></div>

                          <img
                            src={coverImage}
                            alt={country.location}
                            className="h-full w-full transform rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-110"
                          />

                          <div className="absolute left-[50%] top-[50%] z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                            <h3
                              className="text-nowrap text-[24px] font-bold capitalize"
                              style={{ color: primaryColor }}
                            >
                              {country.location}
                            </h3>
                            <p
                              className="text-lg font-semibold"
                              style={{ color: primaryColor }}
                            >
                              {country.chin}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
            </CarouselContent>

            {!isLoading && relatedSpotData && relatedSpotData.length > 1 && (
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            )}
          </Carousel>
        </Element>
      </main>
    </motion.main>
  );
};

export default ForeignSpot;
