import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../store";
import {
  setAllSpots,
  setSelectSpots,
  setArea,
  setBreaks,
  setDifficulty,
} from "../features/articles/articlesSlice";

// react-icons
import { FaStar } from "react-icons/fa";

// firebase
import { db } from "../main";
import { collection, getDocs, DocumentData } from "firebase/firestore";

// maptiler
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILERSDK_API_KEY;

// framer motion
import { motion } from "framer-motion";

// shadcn
import { Button } from "@/components/ui/button";

const LocalSpots: React.FC = () => {
  const dispatch = useDispatch();
  const { allSpots, selectSpots, area, breaks, difficulty } = useSelector(
    (state: IRootState) => state.articles,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const formHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!allSpots) return;

    const updatedSpots = [...allSpots].filter((spot) => {
      if (area === "all" && breaks === "all" && difficulty === "all") {
        return spot;
      }

      if (area === "all" && breaks !== "all" && difficulty !== "all") {
        if (breaks === spot.breaks && difficulty === spot.difficulty) {
          return spot;
        }
      }
      if (area !== "all" && breaks === "all" && difficulty !== "all") {
        if (area === spot.area && difficulty === spot.difficulty) {
          return spot;
        }
      }
      if (area !== "all" && breaks !== "all" && difficulty === "all") {
        if (area === spot.area && breaks === spot.breaks) {
          return spot;
        }
      }

      if (area === "all" && breaks === "all" && difficulty !== "all") {
        if (difficulty === spot.difficulty) {
          return spot;
        }
      }
      if (area === "all" && breaks !== "all" && difficulty === "all") {
        if (breaks === spot.breaks) {
          return spot;
        }
      }
      if (area !== "all" && breaks === "all" && difficulty === "all") {
        if (area === spot.area) {
          return spot;
        }
      }
    });

    dispatch(setSelectSpots(updatedSpots));

    const map = new maptilersdk.Map({
      container: "map", // container's id or the HTML element to render the map
      style: maptilersdk.MapStyle.STREETS,
      center: [120.9, 23.659], // starting position [lng, lat]
      zoom: 6.1, // starting zoom
    });

    updatedSpots.forEach((spot) => {
      const { name, location } = spot;

      new maptilersdk.Marker({
        color: "#3A4972",
        draggable: false,
      })
        .setLngLat([location.lon, location.lat])
        .setPopup(
          new maptilersdk.Popup({
            closeButton: false,
            maxWidth: "none",
          }).setHTML(
            `<h3 style="color:#FF9500; font-family:Noto Sans TC; font-weight:bold;">${name.chin}</h3>`,
          ),
        )
        .addTo(map);
    });
  };

  const spotHandler = (name: string, id: string) => {
    navigate(`/local-spots/${name}/${id}`);
  };

  const resetHandler = () => {
    dispatch(setArea("all"));
    dispatch(setBreaks("all"));
    dispatch(setDifficulty("all"));
    if (allSpots) {
      dispatch(setSelectSpots(allSpots));

      const map = new maptilersdk.Map({
        container: "map", // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [120.9, 23.659], // starting position [lng, lat]
        zoom: 6.1, // starting zoom
      });

      allSpots.forEach((spot) => {
        const { name, location } = spot;

        new maptilersdk.Marker({
          color: "#3A4972",
          draggable: false,
        })
          .setLngLat([location.lon, location.lat])
          .setPopup(
            new maptilersdk.Popup({
              closeButton: false,
              maxWidth: "none",
            }).setHTML(
              `<h3 style="color:#FF9500; font-family:Noto Sans TC; font-weight:bold;">${name.chin}</h3>`,
            ),
          )
          .addTo(map);
      });
    }
  };

  const fetchDataFromFirebase = async (): Promise<DocumentData[]> => {
    const querySnapshot = await getDocs(collection(db, "local-spots"));
    const spotsArray = querySnapshot.docs.map((doc) => doc.data());

    dispatch(setAllSpots(spotsArray));
    dispatch(setSelectSpots(spotsArray));
    return spotsArray;
  };

  useEffect(() => {
    const map = new maptilersdk.Map({
      container: "map", // container's id or the HTML element to render the map
      style: maptilersdk.MapStyle.STREETS,
      center: [120.9, 23.659], // starting position [lng, lat]
      zoom: 6.1, // starting zoom
    });

    const executeMap = async () => {
      setIsLoading(true);

      try {
        const spotsArray = await fetchDataFromFirebase();

        spotsArray.forEach((spot) => {
          const { name, location, id } = spot;

          const description = `<h3 style="color:#FF9500; font-family:Noto Sans TC; font-weight: 600"><a href="/local-spots/${name.eng}/${id}">${name.chin}</a></h3>`;

          new maptilersdk.Marker({
            color: "#3A4972",
            draggable: false,
          })
            .setLngLat([location.lon, location.lat])
            .setPopup(
              new maptilersdk.Popup({
                closeButton: false,
                maxWidth: "none",
              }).setHTML(description),
            )
            .addTo(map);
        });
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };

    executeMap();
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div id="map" className="h-[450px] w-full"></div>

      <div className="align-container gap-20 py-24">
        <section>
          {/* title */}
          <div className="mb-10 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-bold">浪點查詢</h2>
          </div>

          <form
            method="get"
            onSubmit={formHandler}
            className="grid w-full grid-cols-2 items-end gap-4 rounded-md bg-purple-light px-8 pb-7 pt-4"
          >
            {/* select area */}
            <div className="form-control">
              <label className="label" htmlFor="area">
                <span className="label-text">選擇區域</span>
              </label>
              <select
                id="area"
                name="area"
                value={area}
                className="select select-sm focus:outline-none"
                onChange={(e) => dispatch(setArea(e.target.value))}
              >
                <option value="all">全部</option>
                <option value="西部">西部</option>
                <option value="北部">北部</option>
                <option value="東北部">東北部</option>
                <option value="東部">東部</option>
                <option value="南部">南部</option>
              </select>
            </div>

            {/* select break */}
            <div className="form-control">
              <label className="label" htmlFor="breaks">
                <span className="label-text">選擇浪型</span>
              </label>
              <select
                id="breaks"
                name="breaks"
                value={breaks}
                className="select select-sm focus:outline-none"
                onChange={(e) => dispatch(setBreaks(e.target.value))}
              >
                <option value="all">全部</option>
                <option value="沙灘">沙灘</option>
                <option value="定點">定點</option>
                <option value="河口">河口</option>
                <option value="礁石">礁石</option>
              </select>
            </div>

            {/* select break */}
            <div className="form-control">
              <label className="label" htmlFor="difficulty">
                <span className="label-text">適合程度</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={difficulty}
                className="select select-sm focus:outline-none"
                onChange={(e) => dispatch(setDifficulty(e.target.value))}
              >
                <option value="all">全部</option>
                <option value="新手">新手</option>
                <option value="進階">進階</option>
                <option value="高手">高手</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <Button type="submit" variant={"pink"}>
                Search
              </Button>
              <Button type="button" variant={"blue"} onClick={resetHandler}>
                Reset
              </Button>
            </div>
          </form>

          {(isLoading || !selectSpots) && (
            <p className="mt-10">loading now...</p>
          )}

          {!isLoading && selectSpots && selectSpots.length < 1 && (
            <h3 className="mt-10">沒有符合的浪點，請重新查詢。</h3>
          )}

          {!isLoading && selectSpots && selectSpots.length > 0 && (
            <div className="mt-10 grid grid-cols-4 gap-10">
              {selectSpots.map((spot) => {
                const { id, name, mapImage, likes_amount } = spot;
                return (
                  <article
                    key={id}
                    className="card w-full shadow-xl transition-all duration-300 hover:cursor-pointer hover:shadow-2xl"
                    onClick={() => spotHandler(name.eng, id)}
                  >
                    <img
                      src={mapImage}
                      alt={name.chin}
                      className="h-32 w-full rounded-t-2xl object-cover object-center"
                    />

                    <div className="flex h-36 flex-col px-3 py-5">
                      <h3 className="font-semibold">{name.chin}</h3>

                      <div className="mt-auto flex justify-between">
                        <h5 className="font-fashioncountry text-lg capitalize text-turquoise">
                          {name.eng}
                        </h5>
                        <div className="flex items-center gap-1">
                          <FaStar className=" text-yellow" />
                          <span>{likes_amount}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="mb-10 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-bold">即時浪向</h2>
          </div>

          <div className="overflow-hidden">
            <iframe
              className="mx-0 my-0 h-[600px] w-full"
              src="https://earth.nullschool.net/#current/wind/primary/waves/overlay=wind/orthographic=-239.11,24.00,5018"
            ></iframe>
          </div>
        </section>
      </div>
    </motion.main>
  );
};

export default LocalSpots;
