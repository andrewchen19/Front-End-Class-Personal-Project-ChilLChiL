import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { WhenToScore } from "../types";
import { ReadMore } from "../components";

// react-icons
import { FaQuoteLeft, FaQuoteRight, FaRegIdCard } from "react-icons/fa";
import { MdAirplaneTicket } from "react-icons/md";
import { FaWifi } from "react-icons/fa6";
import { BsCurrencyExchange } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { IoWater } from "react-icons/io5";
import { CgDanger } from "react-icons/cg";
import { MdPayment } from "react-icons/md";

// firebase
import { db } from "../main";
import { doc, getDoc, updateDoc, DocumentData } from "firebase/firestore";

const ForeignSpot: React.FC = () => {
  const { name } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);

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
    return <div>Loading...</div>;
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

  return (
    <>
      {/* banner */}
      <div className="relative h-[450px] w-full">
        <img
          src={spotImage}
          alt="foreign-banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
          <h2
            className="text-center font-dripoctober text-7xl tracking-wide text-white"
            style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
          >
            {country.location}
          </h2>
          <p className="mt-2 max-w-[800px] font-helvetica text-base font-semibold leading-6 text-white">
            {spotDesc}
          </p>
        </div>
      </div>

      <main className="mx-auto flex w-[90%] max-w-5xl flex-col gap-16 py-14">
        {/* when to score */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="mb-6 font-sriracha text-3xl font-bold">
              When To Surf
            </h3>

            {user && (
              <button
                type="button"
                className="btn-purple"
                onClick={() => collectionHandler(user.id)}
              >
                {isLike ? "Already Favorited" : "Add Favorite"}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-5">
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
                    <div className="flex text-sm">
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
        </section>

        {/* quote */}
        <section>
          <figure className="flex h-[600px]">
            <div
              className="flex w-1/2 items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <figcaption className="relative mx-5 my-auto max-w-[500px]">
                <FaQuoteLeft
                  className="text-5xl"
                  style={{ color: spotSecondaryColor }}
                />
                <div
                  className="my-5 font-helvetica text-4xl font-bold leading-tight"
                  style={{ color: spotSecondaryColor }}
                >
                  {quote.desc}
                </div>
                <FaQuoteRight
                  className="ml-auto text-5xl"
                  style={{ color: spotSecondaryColor }}
                />

                <p
                  className="absolute -bottom-10 left-[50%] -translate-x-1/2  text-center font-helvetica font-bold tracking-wide"
                  style={{ color: spotSecondaryColor }}
                >
                  -&nbsp;{quote.name}
                </p>
              </figcaption>
            </div>

            <div className="w-1/2">
              <img
                src={quote.image}
                alt="quote-image"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </figure>
        </section>

        {/* essential */}
        <section>
          <h3 className="mb-6 font-sriracha text-3xl font-bold">
            Travel Essentials
          </h3>

          <div className="columns-2 gap-20">
            <div className="flex flex-col gap-8">
              <img
                src={travelEssentials.image}
                alt="travel-image"
                className="aspect-[4/3] rounded-lg object-cover object-center"
              />

              {/* culture */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">Culture</h4>
                <p className="mt-3 font-helvetica text-gray-500">
                  {travelEssentials.culture}
                </p>
              </div>

              {/* local scene */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  Local scene
                </h4>
                <p className="mt-3 font-helvetica text-gray-500">
                  {travelEssentials.localScene}
                </p>
              </div>

              {/* getThere */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  How to get there
                </h4>
                <p className="mt-3 font-helvetica text-gray-500">
                  {travelEssentials.getThere}
                </p>
              </div>

              {/* bring */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  What to bring
                </h4>
                <p className="mt-3 font-helvetica text-gray-500">
                  {travelEssentials.localScene}
                </p>
              </div>

              {/* leisure */}
              <div>
                <h4 className="font-palanquin text-xl font-bold">
                  Leisure time
                </h4>
                <p className="mt-3 font-helvetica text-gray-500">
                  {travelEssentials.downTime}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* quick tips */}
        <section>
          <div
            className="rounded-xl p-10"
            style={{ backgroundColor: primaryColor }}
          >
            <h3 className="mb-10 text-center font-palanquin text-2xl font-bold text-white">
              Quick Tips
            </h3>

            <div className="grid grid-cols-4 gap-x-4 gap-y-5 text-white">
              <div className="flex flex-col items-center">
                <MdAirplaneTicket
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Travel Time
                  </h4>
                  <div className="mt-2 flex flex-col items-center">
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
              </div>

              <div className="flex flex-col items-center ">
                <FaWifi
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Connectivity
                  </h4>
                  <p className="mt-2 text-center">{quickTips.connectivity}</p>
                </div>
              </div>

              <div className="flex flex-col items-center ">
                <BsCurrencyExchange
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">Currency</h4>
                  <p className="mt-2 text-center">{quickTips.currency}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <GiTwoCoins
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
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
              </div>

              <div className="flex flex-col items-center">
                <FaRegIdCard
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Visa Requirements
                  </h4>
                  <p className="mt-2 text-center">{quickTips.visa}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <IoWater
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Drink Water Quality
                  </h4>
                  <p className="mt-2 text-center">{quickTips.waterQuality}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <CgDanger
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">Hazard</h4>
                  <p className="mt-2 text-center">{quickTips.hazard}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <MdPayment
                  className="text-3xl"
                  style={{ color: spotSecondaryColor }}
                />

                <div className="mt-2 flex flex-col items-center">
                  <h4 className="font-palanquin text-xl font-bold">
                    Cash & Card
                  </h4>
                  <p className="mt-2 text-center">{quickTips.cashCard}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* other zone */}
        <section>
          <h3 className="mb-6 font-sriracha text-3xl font-bold">
            Explore Other Zones
          </h3>

          {isLoading && <p>loading now...</p>}

          <div className="mx-auto grid grid-cols-2 gap-10">
            {!isLoading &&
              relatedSpotData.length > 1 &&
              relatedSpotData.map((spot) => {
                const { id, country, coverImage } = spot;
                return (
                  <article
                    key={id}
                    className="relative h-[420px] overflow-hidden rounded-lg hover:cursor-pointer"
                    onClick={() => spotHandler(country.eng, id)}
                  >
                    <img
                      src={coverImage}
                      alt={country.location}
                      className="h-full w-full transform rounded-lg object-cover object-center transition-transform duration-500 hover:scale-110"
                    />

                    <div className="absolute left-[50%] top-[50%] z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                      <h3
                        className="text-xl font-bold capitalize"
                        style={{ color: spotSecondaryColor }}
                      >
                        {country.location}
                      </h3>
                      <p
                        className="text-lg font-semibold"
                        style={{ color: spotSecondaryColor }}
                      >
                        {country.chin}
                      </p>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      </main>
    </>
  );
};

export default ForeignSpot;
