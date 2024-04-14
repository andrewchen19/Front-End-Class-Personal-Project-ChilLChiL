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
    <div>
      <h3>地點：{spotName.chin}</h3>
      <div>
        地點描述：
        {splitText(desc).map((item, index) => {
          return (
            <p key={index} className="mt-3">
              {item}
            </p>
          );
        })}
      </div>
      <p>面向：{toward}</p>
      <p>類型：{breaks}</p>
      <p>最佳潮汐：{bestTide}</p>
      <p>方向：{direction}</p>
      <p>最佳風向：{bestWind}</p>
      <p>適合程度：{difficulty}</p>
      <img src={infoImage} alt="info-image" />
    </div>
  );
};

export default LocalSpot;
