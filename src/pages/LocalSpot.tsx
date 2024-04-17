import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

import { splitText } from "../utils";

const LocalSpot: React.FC = () => {
  const { name, id } = useParams();

  const [textData, setTextData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!name) return;

    // firebase
    async function getDocFromFirebase(name: string): Promise<void> {
      setIsLoading(true);
      const docRef = doc(db, "local-spots", name);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTextData(docSnap.data());
      } else {
        console.log("No such document!");
      }

      setIsLoading(false);
    }

    getDocFromFirebase(name);
  }, []);

  if (isLoading || !textData) {
    return <div>Loading...</div>;
  }

  const {
    name: spotName,
    desc,
    toward,
    breaks,
    bestTide,
    direction,
    bestWind,
    difficulty,
    infoImage,
  } = textData;

  return (
    <div className="mx-auto w-[90%] max-w-5xl">
      <div>
        <h3 className="mt-10 font-notosans text-2xl font-bold text-pink">
          {spotName.chin}
        </h3>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-10">
        <div className="w-[300px] px-5 py-10 shadow-xl">
          <h4 className="text-center font-notosans text-turquoise">
            浪點圖表資訊
          </h4>
          <img src={infoImage} alt="info-image" className="mt-4" />
        </div>

        <div className="px-5 py-10 font-notosans shadow-xl">
          地點描述：
          {splitText(desc).map((item, index) => {
            return (
              <p key={index} className="mt-3">
                {item}
              </p>
            );
          })}
        </div>
      </div>

      <div className="mb-10 mt-8 flex border border-black font-notosans">
        <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
          <h4 className="px-5 text-center text-turquoise">面向</h4>
          <p className="px-5 text-center">{toward}</p>
        </div>
        <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
          <h4 className="px-5 text-center text-turquoise">類型</h4>
          <p className="px-5 text-center">{breaks}</p>
        </div>
        <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
          <h4 className="px-5 text-center text-turquoise">最佳潮汐</h4>
          <p className="px-5 text-center">{bestTide}</p>
        </div>
        <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
          <h4 className="px-5 text-center text-turquoise">方向</h4>
          <p className="px-5 text-center">{direction}</p>
        </div>
        <div className="my-4 flex flex-grow flex-col gap-1 border-r border-r-turquoise">
          <h4 className="px-5 text-center text-turquoise">最佳風向</h4>
          <p className="px-5 text-center">{bestWind}</p>
        </div>
        <div className="my-4 flex flex-grow flex-col gap-1">
          <h4 className="px-5 text-center text-turquoise">適合程度</h4>
          <p className="px-5 text-center">{difficulty}</p>
        </div>
      </div>
    </div>
  );
};

export default LocalSpot;
