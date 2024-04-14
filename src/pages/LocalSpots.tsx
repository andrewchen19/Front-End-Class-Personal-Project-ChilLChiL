import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { localSpotsList } from "../utils/spots";

// maptiler
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
maptilersdk.config.apiKey = "RB0duSZSInBQe79oKC0F";

const LocalSpots: React.FC = () => {
  const [spots, setSpots] = useState(localSpotsList);
  const [area, setArea] = useState("all");
  const navigate = useNavigate();

  const formHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const updatedSpots = [...localSpotsList].filter((spot) => {
      if (area === "all") return spot;
      else if (area === spot.area) return spot;
    });
    setSpots(updatedSpots);
  };

  const clickHandler = (id: string, name: string) => {
    navigate(`/local-spots/${name}/${id}`);
  };

  useEffect(() => {
    const map = new maptilersdk.Map({
      container: "map", // container's id or the HTML element to render the map
      style: maptilersdk.MapStyle.STREETS,
      center: [120.9, 23.709], // starting position [lng, lat]
      zoom: 6.1, // starting zoom
    });

    spots.forEach((spot) => {
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
            `<h3 style="color:orange; font-family:Noto Sans TC">${name.chin}</h3>`
          )
        )
        .addTo(map);
    });
  }, [spots]);

  return (
    <>
      <div id="map" style={{ width: "100%", height: "450px" }}></div>

      <form
        method="get"
        onSubmit={formHandler}
        className="max-w-[90%] mx-auto font-notosans"
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
        <button>送出表單</button>
      </form>

      <section className="mt-4 max-w-[90%] mx-auto grid grid-cols-4 gap-y-4">
        {spots.map((spot) => {
          const { id, name } = spot;
          return (
            <article
              key={id}
              className="w-[150px] h-[100px] border border-black cursor-pointer"
              onClick={() => clickHandler(id, name.eng)}
            >
              <img src="" alt={name.chin} className="h-[20px] mb-4" />
              <div className="h-[80px]">
                <h3 className="font-notosans">{name.chin}</h3>
                <h5 className="capitalize font-fashioncountry">{name.eng}</h5>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-10 max-w-[90%] mx-auto overflow-hidden">
        <h3>海平面上的風</h3>
        <iframe
          className="w-full h-[600px] mx-0 my-0"
          src="https://earth.nullschool.net/#current/wind/surface/level/orthographic=-239.11,24.00,5018"
        ></iframe>
      </div>
    </>
  );
};

export default LocalSpots;
