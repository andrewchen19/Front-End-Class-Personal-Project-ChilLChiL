import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import surfImg from "../assets/images/illustration-1.png";

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
const centerRotationVariant: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1.5,
    },
  },
};

// shadcn
import { Button } from "@/components/ui/button";

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
    toolbar: [["bold", "italic", "underline", "strike"]],
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
      zoom: 10, // starting zoom
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

        new maptilersdk.Marker({
          color: "#FF4742",
          draggable: false,
        })
          .setLngLat([data.location.lon, data.location.lat])
          .setPopup(
            new maptilersdk.Popup({
              closeButton: false,
              maxWidth: "none",
            }).setHTML(
              `<h3 style="color:#FF9500; font-family:Noto Sans TC; font-weight: 600">${data.name.chin}</h3>`,
            ),
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
        <div className="mx-auto flex w-[90%] max-w-5xl flex-col py-14">
          Loading...
        </div>
      )}

      {!isLoading && textData && infoData && (
        <div className="align-container gap-20 py-24">
          {/* tittle & button */}
          <div className="flex flex-col gap-5">
            {/* title */}
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold leading-6 text-pink">
                {textData.name.chin}
                <span className="pl-1 capitalize">({textData.name.eng})</span>
              </h3>

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

            {/* desc */}
            <div>
              <h3 className="mt-8 text-2xl font-bold">
                {/* <span className="mr-1">{today}</span> */}
                衝浪預報
              </h3>
            </div>
          </div>

          {/* forecast days & hours */}
          <div className="mx-auto -mt-10 flex w-full max-w-[800px] flex-col pl-[125px]">
            {/* days */}
            <div className="flex">
              <p className="w-[192px] text-center text-lg font-bold">
                {infoData.today}
              </p>
              <p className="w-[192px] text-center text-lg font-bold">
                {infoData.tomorrow}
              </p>
              <p className="w-[192px] text-center text-lg font-bold">
                {infoData.afterTomorrow}
              </p>
            </div>

            {/* hours */}
            <div className="flex">
              {hours.map((hour, index) => {
                return (
                  <p
                    key={index}
                    className="item-center flex h-8 w-16 justify-center"
                  >
                    <span className="flex items-center text-base font-bold">
                      {hour}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>

          {/* InfoData */}
          <section className="mx-auto -mt-5 flex w-full max-w-[800px] flex-col gap-5">
            <div>
              <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                <img src={compass} alt="weather-icon" className="h-7 w-7" />
                波浪 Swell
              </h3>

              <div className="flex">
                {/* desc */}
                <div className="w-[125px]">
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">
                      最小浪高(m)
                    </span>
                  </p>
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">
                      最大浪高(m)
                    </span>
                  </p>
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">浪向</span>
                  </p>
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">
                      波浪週期(s)
                    </span>
                  </p>
                </div>

                {/* wave & swell */}
                <div className="flex">
                  {infoData.wave.map((item: WaveInfo, index: number) => {
                    const { surf, swells } = item;
                    const { direction, period } = swells[0];
                    return (
                      <div key={index} className="w-16">
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
                            style={{
                              transform: `rotate(${direction.toFixed(0)}deg)`,
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

            <div>
              <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                <img src={tideHigh} alt="weather-icon" className="h-7 w-7" />
                潮汐 Tide
              </h3>

              <div className="flex">
                {/* desc */}
                <div className="w-[125px]">
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">潮汐(m)</span>
                  </p>
                </div>

                {/* tide */}
                <div className="flex">
                  {infoData.tides.map((item: tideInfo, index: number) => {
                    if (index > 8) return;
                    const { height } = item;
                    return (
                      <div key={index} className="w-16">
                        <p className="item-center flex h-8 justify-center">
                          <span className="flex items-center text-base">
                            {height}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                <img src={windOnshore} alt="weather-icon" className="h-7 w-7" />
                風 Wind
              </h3>

              <div className="flex">
                {/* desc */}
                <div className="w-[125px]">
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">類型</span>
                  </p>
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">風向</span>
                  </p>
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">
                      陣風(km/h)
                    </span>
                  </p>
                </div>

                {/* wind */}
                <div className="flex">
                  {infoData.wind.map((item: WindInfo, index: number) => {
                    const { direction, directionType, gust } = item;
                    return (
                      <div key={index} className="w-16">
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
                            style={{
                              transform: `rotate(${direction.toFixed(0)}deg)`,
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

            <div>
              <h3 className="mb-2 flex items-center gap-1 text-lg font-bold">
                <img
                  src={thermometerSun}
                  alt="weather-icon"
                  className="h-7 w-7"
                />
                天氣 Weather
              </h3>

              <div className="flex">
                {/* desc */}
                <div className="w-[125px]">
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">
                      天氣圖示
                    </span>
                  </p>
                  <p className="item-center flex h-8 w-full justify-center">
                    <span className="flex items-center text-base">
                      溫度(°C)
                    </span>
                  </p>
                </div>

                {/* weather */}
                <div className="flex">
                  {infoData.weather.map((item: WeatherInfo, index: number) => {
                    const { condition, temperature } = item;
                    return (
                      <div key={index} className="w-16">
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
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="grid grid-cols-[auto,1fr] gap-10">
            {/* illustration */}
            <div className="aspect-[9/16] max-w-[300px]">
              <img src={surfImg} alt="surf-image" className="h-full w-full" />
            </div>

            <div className="flex flex-col">
              {/* title */}
              <h3 className="text-xl font-bold leading-6 text-pink">
                最新留言
              </h3>

              {/* real time comments */}
              <div className="mt-4 max-h-[335.31px] w-full overflow-auto">
                {/* container */}
                {commentList.length < 1 && <p>目前尚未有留言.....</p>}

                {/* latest 10 comments */}
                {commentList && (
                  <div className="flex flex-col gap-1">
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
                        <>
                          <div key={id} className="flex flex-col gap-1">
                            <div className="flex items-center">
                              <img
                                src={userImage}
                                alt="user-image"
                                className="h-5 w-5 rounded-full"
                              />
                              <h4 className="ml-1 w-[72px]">{userName}</h4>

                              <p className="w-[125px] text-xs">
                                {formatMessageTime(created_at)}&nbsp;
                                {isEdited && <span>(edited)</span>}
                              </p>

                              {name && user && userId === user.id && (
                                <>
                                  <span
                                    className="cursor-pointer text-xs text-gray-500 underline hover:text-gray-600"
                                    onClick={() => getCommentHandler(id)}
                                  >
                                    Edit
                                  </span>
                                  <span
                                    className="ml-2 cursor-pointer text-xs text-gray-500 underline hover:text-gray-600"
                                    onClick={() => deleteButtonHandler(id)}
                                  >
                                    Delete
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="rounded-lg bg-black text-sm text-turquoise">
                              <div className="ql-snow">
                                <div
                                  className="ql-editor py-2"
                                  data-gramm="false"
                                >
                                  <Markup content={comment} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* leave comment */}
              <div className="mt-auto">
                {/* text-editor */}
                <div className="max-w-[365px]">
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
          </section>

          {/* textData */}
          <section>
            <h3 className="text-2xl font-bold">浪點資訊</h3>
            <div className="mt-5 grid grid-cols-[auto,1fr] gap-10">
              <div className="w-[300px] px-5 py-10 shadow-xl">
                <h4 className="text-center text-turquoise">浪點圖表</h4>
                <img
                  src={textData.infoImage}
                  alt="info-image"
                  className="mt-4"
                />
              </div>

              <div className="px-5 py-10 shadow-xl">
                地點描述：
                {splitText(textData.desc).map((item, index) => {
                  return (
                    <p key={index} className="mt-3">
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex border border-black">
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
            variants={centerRotationVariant}
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
