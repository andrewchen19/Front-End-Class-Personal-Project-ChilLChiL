import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { ReactECharts } from "./ReactEchart";
import {
  changeSpotName,
  executeOption,
  executeOption2,
  executeOption3,
} from "../utils";
import seaWave from "../assets/icons/sea-wave.svg";
import LoadingSmall from "./LoadingSmall";
import UseGetDocFromFirestore from "@/utils/hooks/useGetDocFromFirestore";

// lottie-react
import Lottie from "lottie-react";
import surfBoy from "../assets/lotties/surf-boy.json";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

// shadcn
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RealtimeContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  const [localSpotNameList, setLocalSpotNameList] = useState<string[] | null>(
    null,
  );
  const [localSpotNameIndex, setLocalSpotNameIndex] = useState<number>(0);
  const [localSpotsList, setLocalSpotsList] = useState<DocumentData[] | null>(
    null,
  );
  const [isTabletSize, setIsTabletSize] = useState(window.innerWidth > 768);
  const [isDesktopSize, setIsDesktopSize] = useState(window.innerWidth > 1280);

  if (!user) return;

  // custom hook
  const { isLoading, data } = UseGetDocFromFirestore({
    path: "users",
    docId: user.id,
  });

  useEffect(() => {
    if (isLoading || !data) return;

    setLocalSpotNameList(data?.localSpotsCollection);

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

    fetchLocalSpotsDataFromFirebase(data?.localSpotsCollection);
  }, [isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setIsTabletSize(window.innerWidth > 768);
      setIsDesktopSize(window.innerWidth > 1280);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading || !localSpotNameList || !localSpotsList) {
    return (
      <section>
        <div className="flex items-center gap-6">
          <img src={seaWave} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">浪點即時資訊</h2>
        </div>

        <div className="mx-auto mt-7 w-full">
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
        <div className="flex items-center gap-6">
          <img src={seaWave} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">浪點即時資訊</h2>
        </div>

        <div className="mt-10 flex gap-4">
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
      <div className="flex items-center gap-6">
        <img src={seaWave} alt="image" className="h-8 w-8" />
        <h2 className="text-2xl font-bold">浪點即時資訊</h2>
      </div>

      <Tabs
        value={localSpotNameList[localSpotNameIndex]}
        className="mt-4 flex w-full flex-col"
      >
        <div className="mt-4">
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
            <div className="mt-4 flex h-[500px] sm:mt-10">
              <div className="w-full">
                <ReactECharts
                  option={
                    isDesktopSize && isTabletSize
                      ? executeOption({ waveData, gustData, tempData })
                      : isTabletSize
                        ? executeOption2({ waveData, gustData, tempData })
                        : executeOption3({ waveData, gustData, tempData })
                  }
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RealtimeContainer;
