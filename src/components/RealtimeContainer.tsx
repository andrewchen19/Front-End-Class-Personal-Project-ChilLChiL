import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { ReactECharts } from "./ReactEchart";
import { changeSpotName, executeOption } from "../utils";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

// shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <p className="mt-8">loading now...</p>
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
        <h3 className="mt-8">尚未收藏浪點...</h3>
      </section>
    );
  }

  let waveData: number[] = [];
  localSpotsList[localSpotNameIndex].wave.map((item: DocumentData) => {
    const info = item.surf.max;
    waveData.push(info);
  });

  let gustData: number[] = [];
  localSpotsList[localSpotNameIndex].wind.map((item: DocumentData) => {
    const info = item.gust.toFixed(1);
    gustData.push(info);
  });

  let tempData: number[] = [];
  localSpotsList[localSpotNameIndex].weather.map((item: DocumentData) => {
    const info = item.temperature.toFixed(1);
    tempData.push(info);
  });

  return (
    <section>
      <h2 className="text-2xl font-bold">浪點即時資訊</h2>

      <Tabs
        value={
          localSpotNameList && localSpotsList.length > 0
            ? localSpotNameList[localSpotNameIndex]
            : ""
        }
        className="mt-8 flex w-full flex-col"
      >
        <div className="flex">
          <TabsList>
            {localSpotNameList.map((name, index) => (
              <TabsTrigger
                value={name}
                key={index}
                onClick={() => setLocalSpotNameIndex(index)}
              >
                {changeSpotName(name)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {localSpotNameList.map((name) => (
          <TabsContent key={name} value={name}>
            <div className="mt-16 h-[600px] w-full">
              <ReactECharts
                option={executeOption({ waveData, gustData, tempData })}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RealtimeContainer;
