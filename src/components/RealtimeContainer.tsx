import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { ReactECharts } from "./ReactEchart";
import { changeSpotName, executeOption } from "../utils";
import location from "../assets/icons/location.svg";
import LoadingSmall from "./LoadingSmall";
import surfBoy from "../assets/lotties/surf-boy.json";

// lottie-react
import Lottie from "lottie-react";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

// shadcn
import { Button } from "@/components/ui/button";
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
        <div className="flex items-center gap-3">
          <img src={location} alt="image" className="h-[52px] w-[52px]" />
          <h2 className="text-2xl font-bold">浪點即時資訊</h2>
        </div>

        <div className="mt-7">
          <LoadingSmall />
        </div>
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
        <div className="flex items-center gap-3">
          <img src={location} alt="image" className="h-[52px] w-[52px]" />
          <h2 className="text-2xl font-bold">浪點即時資訊</h2>
        </div>

        <div className="mt-4 flex gap-4">
          <div
            className="h-[180px] w-[180px]"
            style={{ transform: "scaleX(-1)" }}
          >
            <Lottie animationData={surfBoy} loop={true} />
          </div>

          <div className="mt-5">
            <div className="font-sriracha">
              <h3>No any collection yet?</h3>
              <p>Explore some spots now!</p>
            </div>

            <div className="mt-2">
              <Link to="/local-spots">
                <Button variant={"turquoise-hipster"} size={"xs"}>
                  Local Spots
                </Button>
              </Link>
            </div>
          </div>
        </div>
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
      <div className="flex items-center gap-3">
        <img src={location} alt="image" className="h-[52px] w-[52px]" />
        <h2 className="text-2xl font-bold">浪點即時資訊</h2>
      </div>

      <Tabs
        value={localSpotNameList[localSpotNameIndex]}
        className="mt-4 flex w-full flex-col"
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
            <div className="mt-16 h-[500px] w-full">
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
