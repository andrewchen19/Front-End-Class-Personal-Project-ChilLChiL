import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import beachUmbrella from "../assets/icons/beach-umbrella.svg";
import LoadingSmall from "./LoadingSmall";
import surfBoy from "../assets/lotties/surf-boy.json";

// lottie-react
import Lottie from "lottie-react";

// react-icons
import { FaStar } from "react-icons/fa";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LocalSpotsCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();

  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);
  const [localSpotsList, setLocalSpotsList] = useState<DocumentData[] | null>(
    null,
  );

  const spotHandler = (name: string, id: string) => {
    navigate(`/local-spots/${name}/${id}`);
  };

  const fetchLocalSpotsIdFromFirebase = async (): Promise<
    string[] | undefined
  > => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
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
        const docRef = doc(db, "local-spots", id);
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
    setIsLocalLoading(true);

    try {
      const data = await fetchLocalSpotsIdFromFirebase();
      if (!data) return;
      await fetchLocalSpotsDataFromFirebase(data);
    } catch (error) {
      console.log(error);
    }

    setIsLocalLoading(false);
  };

  useEffect(() => {
    fetchDataFromFirebase();
  }, []);

  return (
    <section>
      <div className="mb-10 flex border-b border-gray-300 pb-4 text-2xl font-bold">
        <div className="flex items-center gap-3">
          <img src={beachUmbrella} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">國內浪點</h2>
        </div>
      </div>

      {(isLocalLoading || !localSpotsList) && (
        <div className="mt-11">
          <LoadingSmall />
        </div>
      )}

      {!isLocalLoading && localSpotsList && localSpotsList.length < 1 && (
        <div className="flex gap-4">
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
      )}

      {!isLocalLoading && (
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {localSpotsList &&
            localSpotsList.length > 0 &&
            localSpotsList.map((spot) => {
              const { id, name, mapImage, likes_amount } = spot;
              return (
                <Card
                  key={id}
                  className="group relative flex flex-grow shadow-xs duration-300 hover:cursor-pointer hover:shadow-lg"
                  onClick={() => spotHandler(name.eng, id)}
                >
                  <CardContent className="flex h-full w-full flex-col">
                    <div className="h-[150px] w-full overflow-hidden">
                      <img
                        src={mapImage}
                        alt={name.chin}
                        className="h-full w-full object-cover object-center duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-grow flex-col p-3">
                      <h3 className="font-semibold">{name.chin}</h3>

                      <div className="mt-10 flex justify-between">
                        <h5 className="font-fashioncountry text-lg capitalize text-turquoise ">
                          {name.eng}
                        </h5>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow group-hover:animate-accordion-up" />
                          <span>{likes_amount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </section>
  );
};

export default LocalSpotsCollectionContainer;
