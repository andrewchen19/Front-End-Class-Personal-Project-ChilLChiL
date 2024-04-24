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
maptilersdk.config.apiKey = "RB0duSZSInBQe79oKC0F";

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
                `<h3 style="color:#FF9500; font-family:Noto Sans TC; font-weight: 600">${name.chin}</h3>`,
              ),
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
    <>
      <div id="map" className="h-[450px] w-full"></div>

      <div className="mx-auto flex w-[90%] max-w-5xl flex-col gap-16 py-14">
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
            <button
              type="submit"
              className="btn btn-sm bg-pink-light hover:bg-pink-dark w-full border-transparent hover:border-transparent"
            >
              Search
            </button>
            <button
              type="button"
              className="btn btn-sm border-transparent bg-blue-light hover:border-transparent hover:bg-blue-dark"
              onClick={resetHandler}
            >
              Reset
            </button>
          </div>
        </form>

        {!isLoading && selectSpots && selectSpots.length < 1 && (
          <p className="text-xl font-bold">沒有符合的浪點，請重新查詢。</p>
        )}

        {!isLoading && selectSpots && selectSpots.length > 0 && (
          <section className="grid grid-cols-4 gap-10">
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

                  <div className="flex flex-col gap-3 p-3">
                    <h3 className="font-semibold">{name.chin}</h3>

                    <div className="flex justify-between">
                      <h5 className="font-fashioncountry capitalize text-turquoise">
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
          </section>
        )}

        <section>
          <h3 className="text-2xl font-bold">海平面上的風(即時資訊)</h3>
          <div className="mt-5 overflow-hidden">
            <iframe
              className="mx-0 my-0 h-[600px] w-full"
              src="https://earth.nullschool.net/#current/wind/surface/level/orthographic=-239.11,24.00,5018"
            ></iframe>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocalSpots;
