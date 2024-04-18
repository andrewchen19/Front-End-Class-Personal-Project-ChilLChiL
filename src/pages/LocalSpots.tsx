import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// firebase
import { db } from "../main";
import { collection, getDocs, DocumentData } from "firebase/firestore";

// maptiler
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
maptilersdk.config.apiKey = "RB0duSZSInBQe79oKC0F";

const LocalSpots: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allSpots, setAllSpots] = useState<DocumentData[] | null>(null);
  const [selectSpots, setSelectSpots] = useState<DocumentData[] | null>(null);
  const [area, setArea] = useState<string>("all");

  const navigate = useNavigate();

  const formHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!allSpots) return;

    const updatedSpots = [...allSpots].filter((spot) => {
      if (area === "all") return spot;
      else if (area === spot.area) return spot;
    });

    setSelectSpots(updatedSpots);

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
            `<h3 style="color:#FF9500; font-family:Noto Sans TC">${name.chin}</h3>`,
          ),
        )
        .addTo(map);
    });
  };

  const clickHandler = (id: string, name: string) => {
    navigate(`/local-spots/${name}/${id}`);
  };

  const fetchDataFromFirebase = async (): Promise<DocumentData[]> => {
    const querySnapshot = await getDocs(collection(db, "local-spots"));
    const spotsArray = querySnapshot.docs.map((doc) => doc.data());

    setAllSpots(spotsArray);
    setSelectSpots(spotsArray);
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
                `<h3 style="color:#FF9500; font-family:Noto Sans TC">${name.chin}</h3>`,
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

      <form
        method="get"
        onSubmit={formHandler}
        className="mx-auto mt-10 flex max-w-[90%] items-center font-notosans"
      >
        <label htmlFor="area">選擇區域：</label>
        <select
          id="area"
          name="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="all">全部</option>
          <option value="西部">西部</option>
          <option value="北部">北部</option>
          <option value="東北部">東北部</option>
          <option value="東部">東部</option>
          <option value="南部">南部</option>
        </select>
        <button
          type="submit"
          className="ml-4 rounded-lg bg-gray-300 px-2 py-1 text-center font-notosans text-white"
        >
          搜尋浪點
        </button>
      </form>

      <section className="mx-auto mt-10 grid w-[90%] max-w-5xl grid-cols-4 gap-7">
        {!isLoading &&
          selectSpots &&
          selectSpots.map((spot) => {
            const { id, name, mapImage, likes_id } = spot;
            return (
              <article
                key={id}
                className="w-[200px] cursor-pointer border border-black"
                onClick={() => clickHandler(id, name.eng)}
              >
                <img
                  src={mapImage}
                  alt={name.chin}
                  className="h-[100px] w-full object-cover object-center"
                />
                <div className="p-2">
                  <h3 className="font-notosans">{name.chin}</h3>
                  <h5 className="font-fashioncountry capitalize">{name.eng}</h5>
                  <p className="font-notosans text-sm">
                    收藏次數:<span className="ml-2">{likes_id.length}</span>
                  </p>
                </div>
              </article>
            );
          })}
      </section>

      <div className="mx-auto my-10 w-[90%] max-w-5xl">
        <h3 className="font-notosans text-lg">海平面上的風 (即時資訊)</h3>
        <div className="overflow-hidden">
          <iframe
            className="mx-0 my-0 h-[600px] w-full"
            src="https://earth.nullschool.net/#current/wind/surface/level/orthographic=-239.11,24.00,5018"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default LocalSpots;
