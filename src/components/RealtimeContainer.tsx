import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { ReactECharts } from "./ReactEchart";
import { changeSpotName, executeOption } from "../utils";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

const RealtimeContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localSpotNameList, setLocalSpotNameList] = useState<string[] | null>(
    null,
  );
  const [localSpotNameIndex, setLocalSpotNameIndex] = useState<number>(0);
  const [localSpotsList, setLocalSpotsList] = useState<DocumentData[] | null>(
    null,
  );

  const fetchLocalSpotsIdFromFirebase = async (): Promise<
    string[] | undefined
  > => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLocalSpotNameList(docSnap.data().localSpotsCollection);
        return docSnap.data().localSpotsCollection;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocalSpotsDataFromFirebase = async (
    data: string[],
  ): Promise<void> => {
    const localSpotsData: DocumentData[] = [];

    for (const id of data) {
      try {
        const docRef = doc(db, "local-data", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          localSpotsData.push(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    }

    setLocalSpotsList(localSpotsData);
  };

  const fetchDataFromFirebase = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const data = await fetchLocalSpotsIdFromFirebase();
      if (!data) return;
      await fetchLocalSpotsDataFromFirebase(data);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataFromFirebase();
  }, []);

  if (isLoading || !localSpotNameList || !localSpotsList) {
    return (
      <section>
        <h2 className="text-2xl font-bold">浪點即時資訊</h2>
        <p className="mt-5">loading now...</p>
      </section>
    );
  }

  if (
    !isLoading &&
    localSpotNameList &&
    localSpotNameList.length < 1 &&
    localSpotsList &&
    localSpotsList.length < 1
  ) {
    return (
      <section>
        <h2 className="text-2xl font-bold">浪點即時資訊</h2>
        <h3 className="mt-5">尚未收藏浪點...</h3>
      </section>
    );
  }

  // console.log(localSpotNameList);
  // console.log(localSpotsList);

  let waveData: number[] = [];
  localSpotsList[localSpotNameIndex].wave.map((item: DocumentData) => {
    const info = item.surf.max;
    waveData.push(info);
  });
  // console.log(waveData);
  let gustData: number[] = [];
  localSpotsList[localSpotNameIndex].wind.map((item: DocumentData) => {
    const info = item.gust.toFixed(1);
    gustData.push(info);
  });
  // console.log(gustData);
  let tempData: number[] = [];
  localSpotsList[localSpotNameIndex].weather.map((item: DocumentData) => {
    const info = item.temperature.toFixed(1);
    tempData.push(info);
  });
  // console.log(tempData);

  return (
    <section>
      <h2 className="text-2xl font-bold">浪點即時資訊</h2>

      <div className="mt-5 flex gap-3">
        {localSpotNameList.map((name, index) => (
          <button
            type="button"
            key={index}
            className={`hover:text-yellow font-medium ${index === localSpotNameIndex ? "text-yellow" : ""}`}
            onClick={() => setLocalSpotNameIndex(index)}
          >
            {changeSpotName(name)}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="mx-auto -ml-[94px] mt-12 h-[600px]">
          <ReactECharts
            option={executeOption({ waveData, gustData, tempData })}
          />
        </div>
      </div>
    </section>
  );
};

export default RealtimeContainer;
