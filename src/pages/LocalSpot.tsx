import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LocalSpot: React.FC = () => {
  const { name, id } = useParams();

  useEffect(() => {
    const fetchSpotData = async () => {
      const spotUrls = [
        `https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${id}&days=2&intervalHours=6`,
        `https://services.surfline.com/kbyg/spots/forecasts/wind?spotId=${id}&days=2&intervalHours=6`,
        `https://services.surfline.com/kbyg/spots/forecasts/tides?spotId=${id}&days=2&intervalHours=6`,
        `https://services.surfline.com/kbyg/spots/forecasts/weather?spotId=${id}&days=2&intervalHours=6`,
      ];

      try {
        const responses = await Promise.all(spotUrls.map((url) => fetch(url)));
        const allData = await Promise.all(responses.map((res) => res.json()));
        console.log(allData);
        console.log(allData[0].data.wave);
        console.log(allData[1].data.wind);
        console.log(allData[2].data.tides);
        console.log(allData[3].data.sunlightTimes);
        console.log(allData[3].data.weather);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSpotData();
  }, []);

  useEffect(() => {
    // firebase
  }, []);

  return (
    <div>
      <h3>id:{id}</h3>
      <p>名稱:{name}</p>
    </div>
  );
};

export default LocalSpot;
