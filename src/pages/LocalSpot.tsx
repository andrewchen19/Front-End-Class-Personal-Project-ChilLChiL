import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { RelatedArticlesContainer } from "../components";
import {
  splitText,
  hours,
  formatMessageTime,
  changeWindName,
  changeToWeatherIcon,
  checkSpotsLng,
  checkSpotsLat,
  directionAbbreviation,
  changeDirection,
} from "../utils";
import {
  WaveInfo,
  tideInfo,
  WindInfo,
  WeatherInfo,
  CommentInfo,
} from "../types";

// nano id
import { nanoid } from "nanoid";

// icons & images
import locationArrow from "../assets/weather/arrow.svg";
import compass from "../assets/weather/compass.svg";
import tideHigh from "../assets/weather/tide-high.svg";
import windOnshore from "../assets/weather/wind-onshore.svg";
import thermometerSun from "../assets/weather/thermometer-sun.svg";
import surfImg from "../assets/images/illustration.jpg";
import { IoMdInformationCircleOutline } from "react-icons/io";

// firebase
import { db } from "../main";
import {
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  setDoc,
  DocumentData,
  collection,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// maptiler
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILERSDK_API_KEY;

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// interwave
// covert HTML sting to JSX, safely render HTML to prevent xss attack
import { Markup } from "interweave";

// framer motion
import { motion, Variants } from "framer-motion";
const centerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

// shadcn
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

const LocalSpot: React.FC = () => {
  const { name } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);

  const [infoData, setInfoData] = useState<DocumentData | null>(null);
  const [textData, setTextData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [commentList, setCommentList] = useState<DocumentData | []>([]);
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<DocumentData | null>(null);
  const [chooseCommentId, setChooseCommentId] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const removeUserLikesFromFirebase = async (id: string): Promise<void> => {
    if (!name) return;
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { localSpotsCollection } = docSnap.data();
      const newLocalSpotsCollection = [...localSpotsCollection].filter(
        (item) => item !== name,
      );
      await updateDoc(userRef, {
        localSpotsCollection: newLocalSpotsCollection,
      });
    }
  };
  const removeSpotLikesFromFirebase = async (): Promise<void> => {
    if (!name) return;
    const localSpotRef = doc(db, "local-spots", name);
    const docSnap = await getDoc(localSpotRef);
    if (docSnap.exists()) {
      const { likes_amount } = docSnap.data();
      const newLikes_amount = likes_amount - 1;
      await updateDoc(localSpotRef, {
        likes_amount: newLikes_amount,
      });
    }
  };
  const addUserLikesToFirebase = async (id: string): Promise<void> => {
    if (!name) return;
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { localSpotsCollection } = docSnap.data();
      const newLocalSpotsCollection = [...localSpotsCollection, name];
      await updateDoc(userRef, {
        localSpotsCollection: newLocalSpotsCollection,
      });
    }
  };
  const addSpotLikesToFirebase = async (): Promise<void> => {
    if (!name) return;
    const localSpotRef = doc(db, "local-spots", name);
    const docSnap = await getDoc(localSpotRef);
    if (docSnap.exists()) {
      const { likes_amount } = docSnap.data();
      const newLikes_amount = likes_amount + 1;
      await updateDoc(localSpotRef, {
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
  const deleteButtonHandler = (id: string) => {
    setChooseCommentId(id);
    setShowModal(true);
  };
  const deleteCommentHandler = async (): Promise<void> => {
    if (!name) return;
    if (!chooseCommentId) return;
    try {
      const spotRef = doc(db, "local-spots", name);
      const subCollectionRef = collection(spotRef, "comments");
      await deleteDoc(doc(subCollectionRef, chooseCommentId));
      setComment("");
      setIsEditStatus(false);
      toast.success("Delete comment successful 🎉");
    } catch (error) {
      console.log(error);
    }
  };
  const getCommentHandler = async (id: string): Promise<void> => {
    if (!name) return;
    try {
      const commentRef = doc(db, "local-spots", name, "comments", id);

      const docSnap = await getDoc(commentRef);

      if (docSnap.exists()) {
        setIsEditStatus(true);
        setEditInfo(docSnap.data());
        setComment(docSnap.data().comment);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const commentHandler = async (): Promise<void> => {
    if (!name) return;
    if (!user) {
      toast.warning("Please Log In First 😵");
      return;
    }
    if (!comment || comment === "<p><br></p>") {
      toast.warning("Comment can't be empty 😬");
      return;
    }
    if (isEditStatus) {
      setEditedCommentToFirebase();
    } else {
      addNewCommentToFirebase();
    }
  };
  const cancelEditHandler = (): void => {
    setComment("");
    setEditInfo(null);
    setIsEditStatus(false);
  };

  async function checkStatus(name: string): Promise<void> {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;
      const { localSpotsCollection } = docSnap.data();
      if (localSpotsCollection.includes(name)) {
        setIsLike(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getLocalSpotTextFromFirebase(
    name: string,
  ): Promise<DocumentData | undefined> {
    const docRef = doc(db, "local-spots", name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTextData(docSnap.data());
      return docSnap.data();
    }
  }
  async function getLocalSpotInfoFromFirebase(name: string): Promise<void> {
    const docRef = doc(db, "local-data", name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setInfoData(docSnap.data());
    }
  }
  async function getUserInfoFromFirebase(
    commentArray: DocumentData[],
  ): Promise<void> {
    let newArray = [];

    for (const comment of commentArray) {
      const docRef = doc(db, "users", comment.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userName = docSnap.data().name;
        const userImage = docSnap.data().profile_picture;
        const newComment = { ...comment, userName, userImage };
        newArray.push(newComment);
      }
    }

    setCommentList(newArray);
  }
  async function getCommentsFromFirebase(name: string): Promise<void> {
    const commentsCollectionRef = collection(
      db,
      "local-spots",
      name,
      "comments",
    );

    // order and limit
    const q = query(
      commentsCollectionRef,
      orderBy("created_at", "desc"),
      limit(10),
    );

    const querySnapshot = await getDocs(q);
    const commentArray = querySnapshot.docs.map((doc) => doc.data());
    await getUserInfoFromFirebase(commentArray);
  }
  async function addNewCommentToFirebase(): Promise<void> {
    if (!name) return;
    if (!user) return;

    const commentId = nanoid();

    const commentObj = {
      id: commentId,
      userId: user.id,
      comment,
      created_at: Date.now(),
      updated_at: Date.now(),
      isEdited: false,
    };

    try {
      const spotRef = doc(db, "local-spots", name);
      const subCollectionRef = collection(spotRef, "comments");
      await setDoc(doc(subCollectionRef, commentId), commentObj);
      toast.success("Add comment successful 🎉");
      setComment("");
    } catch (error) {
      console.log(error);
    }
  }
  async function setEditedCommentToFirebase(): Promise<void> {
    if (!name) return;
    if (!user) return;
    if (!editInfo) return;

    const commentObj = {
      ...editInfo,
      comment,
      updated_at: Date.now(),
      isEdited: true,
    };

    try {
      const spotRef = doc(db, "local-spots", name);
      const subCollectionRef = collection(spotRef, "comments");
      await setDoc(doc(subCollectionRef, editInfo.id), commentObj);
      toast.success("Edit comment successful 🎉");
      setComment("");
      setIsEditStatus(false);
      setEditInfo(null);
    } catch (error) {
      console.log(error);
    }
  }

  const modules = {
    toolbar: [[{ header: [false] }], ["bold", "italic", "underline", "strike"]],
  };

  if (!name) return;

  const centerLng = checkSpotsLng(name);
  const centerLat = checkSpotsLat(name);
  const centerArray: maptilersdk.LngLatLike | undefined = [
    centerLng,
    centerLat,
  ];

  useEffect(() => {
    const map = new maptilersdk.Map({
      container: "map", // container's id or the HTML element to render the map
      style: maptilersdk.MapStyle.STREETS,
      center: centerArray, // starting position [lng, lat]
      zoom: 13, // starting zoom
    });

    const executeFunction = async () => {
      if (!name) return;
      setIsLoading(true);

      try {
        if (user) {
          await checkStatus(name);
        }
        await getLocalSpotInfoFromFirebase(name);
        const data = await getLocalSpotTextFromFirebase(name);
        if (!data) return;

        const description = `<h3 style="color:#FF9500; font-family:Noto Sans TC; font-weight: 600">${data.name.chin}</h3>`;

        new maptilersdk.Marker({
          color: "#FF4742",
          draggable: false,
        })
          .setLngLat([data.location.lon, data.location.lat])
          .setPopup(
            new maptilersdk.Popup({
              closeButton: false,
              maxWidth: "none",
            }).setHTML(description),
          )
          .addTo(map);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };

    executeFunction();
  }, []);

  useEffect(() => {
    if (!name) return;

    const fetchRealTimeData = async () => {
      const unsubscribe = onSnapshot(
        collection(db, "local-spots", name, "comments"),
        async (snapshot) => {
          // console.log(snapshot.docChanges());

          if (snapshot.docChanges().length > 0) {
            const { type } = snapshot.docChanges()[0];
            if (type === "added" || type === "modified" || type === "removed") {
              // console.log("execute");
              await getCommentsFromFirebase(name);
            }
          }
        },
      );

      return () => unsubscribe();
    };

    fetchRealTimeData();
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div id="map" className="h-[450px] w-full"></div>

      {(isLoading || !textData || !infoData) && (
        <div className="align-container py-24">Loading...</div>
      )}

      {!isLoading && textData && infoData && (
        <div className="align-container gap-20 pb-24 pt-16">
          {/* breadcrumbs */}
          <div className="breadcrumbs text-sm text-gray-500">
            <ul>
              <li>
                <Link to="/" className="underline-offset-4">
                  首頁
                </Link>
              </li>
              <li>
                <Link to="/local-spots" className="underline-offset-4">
                  台灣浪點
                </Link>
              </li>
              <li>{textData.name.chin}</li>
            </ul>
          </div>

          {/* textData */}
          <section className="-mt-8">
            {/* title */}
            <div className="mb-10 flex items-center justify-between border-b border-gray-300 pb-4">
              <h2 className="text-2xl font-bold">浪點資訊</h2>

              {user && (
                <Button
                  type="button"
                  variant={"purple-hipster"}
                  onClick={() => collectionHandler(user.id)}
                >
                  {isLike ? "已收藏" : "加入收藏"}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-10">
              <div className="flex w-[300px] flex-col gap-6 px-5 py-8 shadow-xl">
                <h4 className="text-center text-turquoise">浪點圖表</h4>
                <img src={textData.infoImage} alt="info-image" />
              </div>

              <div className="flex flex-col gap-2 px-5 py-5 shadow-xl">
                <h4 className="font-semibold">
                  地點：
                  <span className="ml-1 font-normal capitalize text-gray-800">
                    {textData.name.chin} ({textData.name.eng})
                  </span>
                </h4>
                <h4 className="font-semibold">
                  所在鄉鎮市：
                  <span className="ml-1 font-normal text-gray-800">
                    {textData.country}
                  </span>
                </h4>
                <div>
                  <h4 className="mb-1 font-semibold">交通方式：</h4>
                  {textData.trans.map((item: string, index: number) => {
                    return (
                      <p key={index} className="mb-3 text-gray-800 last:mb-0">
                        {index + 1}. {item}
                      </p>
                    );
                  })}
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">地點描述：</h4>
                  {splitText(textData.desc).map((item, index) => {
                    return (
                      <p key={index} className="mb-3 text-gray-800 last:mb-0">
                        {item}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-10 flex border border-black">
              <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
                <h4 className="px-5 text-center text-turquoise">面向</h4>
                <p className="px-5 text-center">{textData.toward}</p>
              </div>
              <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
                <h4 className="px-5 text-center text-turquoise">類型</h4>
                <p className="px-5 text-center">{textData.breaks}</p>
              </div>
              <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
                <h4 className="px-5 text-center text-turquoise">最佳潮汐</h4>
                <p className="px-5 text-center">{textData.bestTide}</p>
              </div>
              <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
                <h4 className="px-5 text-center text-turquoise">方向</h4>
                <p className="px-5 text-center">{textData.direction}</p>
              </div>
              <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
                <h4 className="px-5 text-center text-turquoise">最佳風向</h4>
                <p className="px-5 text-center">{textData.bestWind}</p>
              </div>
              <div className="my-4 flex flex-grow flex-col gap-1">
                <h4 className="px-5 text-center text-turquoise">適合程度</h4>
                <p className="px-5 text-center">{textData.difficulty}</p>
              </div>
            </div>
          </section>

          {/* InfoData */}
          <section>
            {/* desc */}
            <div className="grid grid-cols-[auto,1fr] items-center border-b border-gray-300 pb-4">
              <h2 className="w-[150px] text-2xl font-bold">衝浪預報</h2>

              {/* forecast days & hours */}
              <div className="mx-auto flex w-full flex-col">
                {/* days */}
                <div className="grid grid-cols-3 text-center text-lg font-bold">
                  <p>{infoData.today} Today</p>
                  <p>{infoData.tomorrow}</p>
                  <p>{infoData.afterTomorrow}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-9 pl-[150px] text-center font-semibold ">
              {hours.map((hour, index) => {
                return <p key={index}>{hour}</p>;
              })}
            </div>

            <div className="mx-auto mt-5 flex w-full flex-col gap-5">
              {/* swell */}
              <div>
                <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                  <img src={compass} alt="weather-icon" className="h-9 w-9" />
                  波浪 Swell
                </h3>

                <div className="grid grid-cols-[auto,1fr]">
                  {/* desc */}
                  <div className="w-[150px]">
                    <p className="flex h-8 w-full items-center pl-10 text-base">
                      最小浪高 (m)
                    </p>
                    <p className="flex h-8 w-full items-center gap-3 pl-2 text-base">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoMdInformationCircleOutline className="mt-[3px] h-5 w-5 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-center">
                              對於初學者而言
                              <br />
                              1公尺內的浪高較為合適與安全
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      最大浪高 (m)
                    </p>
                    <p className="flex h-8 w-full items-center pl-10 text-base">
                      浪向
                    </p>
                    <p className="flex h-8 w-full items-center gap-3 pl-2 text-base">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoMdInformationCircleOutline className="mt-[3px] h-5 w-5 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-center">
                              週期介於10~16秒之間
                              <br />
                              是衝浪者心中最理想的狀態
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      波浪週期 (s)
                    </p>
                  </div>

                  <div className="grid grid-cols-9">
                    {infoData.wave.map((item: WaveInfo, index: number) => {
                      const { surf, swells } = item;
                      const { direction, period } = swells[0];
                      return (
                        <div key={index} className="flex-grow">
                          <p className="item-center flex h-8 justify-center">
                            <span className="flex items-center text-base">
                              {surf.min}
                            </span>
                          </p>
                          <p className="item-center flex h-8 justify-center">
                            <span className="flex items-center text-base">
                              {surf.max}
                            </span>
                          </p>
                          <p className="flex h-8 items-center justify-center">
                            <img
                              src={locationArrow}
                              alt="arrow-icon"
                              className="h-5 w-5"
                              title={directionAbbreviation(direction)}
                              style={{
                                transform: `rotate(${changeDirection(direction)}deg)`,
                              }}
                            />
                          </p>

                          <p className="item-center flex h-8 justify-center">
                            <span className="flex items-center text-base">
                              {period}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* tide */}
              <div>
                <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                  <img
                    src={tideHigh}
                    alt="weather-icon"
                    className="mt-[7px] h-9 w-9"
                  />
                  潮汐 Tide
                </h3>

                <div className="grid grid-cols-[auto,1fr]">
                  {/* desc */}
                  <div className="w-[150px]">
                    <p className="flex h-8 w-full items-center gap-3 pl-2 text-base">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoMdInformationCircleOutline className="mt-[3px] h-5 w-5 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-center">
                              潮汐的變化會直接影響浪型
                              <br />
                              不同浪點所適合的水位也有所不同
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      潮汐 (m)
                    </p>
                  </div>

                  <div className="grid grid-cols-9">
                    {infoData.tides.map((item: tideInfo, index: number) => {
                      if (index > 8) return;
                      const { height } = item;
                      return (
                        <div key={index} className="flex-grow">
                          <p className="item-center flex h-8 justify-center">
                            <span className="flex items-center text-base">
                              {height.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* wind */}
              <div>
                <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                  <img
                    src={windOnshore}
                    alt="weather-icon"
                    className="h-9 w-9"
                  />
                  風 Wind
                </h3>

                <div className="grid grid-cols-[auto,1fr]">
                  {/* desc */}
                  <div className="w-[150px]">
                    <p className="flex h-8 w-full items-center gap-3 pl-2 text-base">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoMdInformationCircleOutline className="mt-[3px] h-5 w-5 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-center">
                              微弱的陸風有助於衝浪
                              <br />
                              提高實際的衝浪體驗
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      類型
                    </p>
                    <p className="flex h-8 w-full items-center pl-10 text-base">
                      風向
                    </p>
                    <p className="flex h-8 w-full items-center gap-3 pl-2 text-base">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IoMdInformationCircleOutline className="mt-[3px] h-5 w-5 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-center">
                              小於每小時21公里的風速
                              <br />
                              是最理想的狀態
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      陣風 (km/h)
                    </p>
                  </div>

                  <div className="grid grid-cols-9">
                    {infoData.wind.map((item: WindInfo, index: number) => {
                      const { direction, directionType, gust } = item;

                      return (
                        <div key={index} className="flex-grow">
                          <p className="item-center flex h-8 justify-center">
                            <span className="flex items-center text-base">
                              {changeWindName(directionType)}
                            </span>
                          </p>
                          <p className="flex h-8 items-center justify-center">
                            <img
                              src={locationArrow}
                              alt="arrow-icon"
                              className="h-5 w-5"
                              title={directionAbbreviation(direction)}
                              style={{
                                transform: `rotate(${changeDirection(direction)}deg)`,
                              }}
                            />
                          </p>
                          <p className="item-center flex h-8 justify-center">
                            <span className="flex items-center text-base">
                              {gust.toFixed(1)}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* weather */}
              <div>
                <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                  <img
                    src={thermometerSun}
                    alt="weather-icon"
                    className="h-9 w-9"
                  />
                  天氣 Weather
                </h3>

                <div className="grid grid-cols-[auto,1fr]">
                  {/* desc */}
                  <div className="w-[150px]">
                    <p className="flex h-8 w-full items-center pl-10 text-base">
                      天氣圖示
                    </p>
                    <p className="flex h-8 w-full items-center pl-10 text-base">
                      溫度 (°C)
                    </p>
                  </div>

                  <div className="grid grid-cols-9">
                    {infoData.weather.map(
                      (item: WeatherInfo, index: number) => {
                        const { condition, temperature } = item;
                        console.log(condition);
                        return (
                          <div key={index} className="flex-grow">
                            <p className="flex h-8 items-center justify-center">
                              {changeToWeatherIcon(condition)}
                            </p>
                            <p className="item-center flex h-8 justify-center">
                              <span className="flex items-center text-base">
                                {temperature.toFixed(1)}
                              </span>
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section>
            {/* title */}
            <div className="mb-10 border-b border-gray-300 pb-4">
              <h2 className="text-2xl font-bold">最新留言</h2>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-10">
              {/* illustration */}
              <div className="aspect-[2/3] max-h-[534.21px]">
                <img
                  src={surfImg}
                  alt="surf-image"
                  className="h-full w-full rounded-xl"
                />
              </div>

              <div className="flex flex-col">
                {/* real time comments */}
                <ScrollArea
                  className={`max-h-[392px] w-full rounded-md  ${commentList.length > 0 ? "bg-gray-100 pt-2" : ""}`}
                >
                  {/* container */}
                  {commentList.length < 1 && <p>目前尚未有留言.....</p>}

                  {/* latest 10 comments */}
                  {commentList && (
                    <div className="flex flex-col">
                      {commentList.map((item: CommentInfo) => {
                        const {
                          id,
                          userId,
                          userName,
                          userImage,
                          comment,
                          created_at,
                          isEdited,
                        } = item;
                        return (
                          <div
                            key={id}
                            className="chat chat-start mb-2 ml-2 py-0"
                          >
                            <div className="chat-image avatar">
                              <div className="mr-1 h-8 w-8 rounded-full border border-black">
                                <img src={userImage} alt="user-image" />
                              </div>
                            </div>
                            <div className="chat-header flex items-center gap-2">
                              {user && userId === user.id ? (
                                <p className="font-medium">{userName} (You)</p>
                              ) : (
                                <p className="font-medium">{userName}</p>
                              )}

                              {name && user && userId === user.id && (
                                <div className="flex gap-2">
                                  <span
                                    className="cursor-pointer text-xs text-olive/80 underline hover:text-olive"
                                    onClick={() => getCommentHandler(id)}
                                  >
                                    Edit
                                  </span>
                                  <span
                                    className="cursor-pointer text-xs text-clay-red/80 underline hover:text-clay-red"
                                    onClick={() => deleteButtonHandler(id)}
                                  >
                                    Delete
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="chat-bubble mt-[4px] h-6 min-w-6 pt-[10px]">
                              <Markup content={comment} />
                            </div>
                            <div className="chat-footer">
                              <time className="text-xs text-gray-600">
                                {formatMessageTime(created_at)}&nbsp;
                                {isEdited && <span>(edited)</span>}
                              </time>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>

                {/* leave comment */}
                <div className="mt-auto">
                  {/* text-editor */}
                  <div className="max-w-full">
                    <ReactQuill
                      theme="snow"
                      value={comment}
                      modules={modules}
                      onChange={setComment}
                      placeholder="請輸入留言 ..."
                    />
                  </div>

                  {/* button */}
                  <div className="mt-3 flex gap-3">
                    <Button
                      type="button"
                      variant={"purple"}
                      size={"sm"}
                      onClick={() => commentHandler()}
                    >
                      {isEditStatus ? "更新留言" : "新增留言"}
                    </Button>

                    {isEditStatus && (
                      <Button
                        type="button"
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() => cancelEditHandler()}
                      >
                        取消
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* related articles */}
          <RelatedArticlesContainer />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex h-full w-full items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={centerVariant}
            viewport={{ once: true }}
            className="flex h-[195px] w-[420px] flex-col rounded-xl bg-white p-5"
            style={{
              boxShadow: "rgba(6, 2, 2, 0.15) 0px 2px 10px",
            }}
          >
            <div className="flex flex-col text-center font-helvetica">
              <h3 className="text-xl font-bold">Delete Comment</h3>
              <p className="mx-auto mt-3 w-[80%] text-sm text-gray-500">
                Deletion is not reversible, and the comment will be completely
                removed from public view.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                Still want to proceed?
              </p>
            </div>

            <div className="mx-auto mt-auto flex gap-4">
              <Button
                type="button"
                variant={"turquoise-hipster"}
                size={"sm"}
                onClick={() => {
                  setChooseCommentId("");
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={"pink-hipster"}
                size={"sm"}
                onClick={() => {
                  deleteCommentHandler();
                  setShowModal(false);
                }}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.main>
  );
};

export default LocalSpot;
