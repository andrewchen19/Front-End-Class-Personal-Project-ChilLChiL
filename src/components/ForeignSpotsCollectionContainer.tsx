import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import coconut from "../assets/icons/coconut.svg";
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
import { Card, CardContent } from "@/components/ui/card";

const ForeignSpotsCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();

  const [foreignSpotsList, setForeignSpotsList] = useState<
    DocumentData[] | null
  >(null);

  const spotHandler = (name: string, id: string) => {
    navigate(`/foreign-spots/${name}/${id}`);
  };

  if (!user) return;

  // custom hook
  const { isLoading: isForeignLoading, data } = UseGetDocFromFirestore({
    path: "users",
    docId: user.id,
  });

  useEffect(() => {
    if (isForeignLoading || !data) return;

    const fetchForeignSpotsDataFromFirebase = async (
      collection: string[],
    ): Promise<void> => {
      const foreignSpotsData: DocumentData[] = [];

      for (const id of collection) {
        try {
          const docRef = doc(db, "foreign-spots", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            foreignSpotsData.push(docSnap.data());
          }
        } catch (error) {
          console.log(error);
        }
      }

      setForeignSpotsList(foreignSpotsData);
    };

    fetchForeignSpotsDataFromFirebase(data?.foreignSpotsCollection);
  }, [isForeignLoading]);

  return (
    <section>
      <div className="mb-10 flex border-b border-gray-300 pb-4 text-2xl font-bold">
        <div className="flex items-center gap-3">
          <img src={coconut} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">國外浪點</h2>
        </div>
      </div>

      {(isForeignLoading || !foreignSpotsList) && (
        <div className="mt-11">
          <LoadingSmall />
        </div>
      )}

      {!isForeignLoading && foreignSpotsList && foreignSpotsList.length < 1 && (
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
              <Link to="/foreign-spots">
                <Button variant={"pink-hipster"} size={"xs"}>
                  Foreign Spots
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {!isForeignLoading && (
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {foreignSpotsList &&
            foreignSpotsList.length > 0 &&
            foreignSpotsList.map((spot) => {
              const { id, country, coverImage } = spot;
              return (
                <Card
                  key={id}
                  className="relative flex flex-grow border-none shadow-xs duration-300 hover:cursor-pointer hover:shadow-lg"
                  onClick={() => spotHandler(country.eng, id)}
                >
                  <CardContent className="group relative">
                    {/* overlay */}
                    <div className="absolute z-10 aspect-square h-full w-full bg-black/15 group-hover:bg-black/50"></div>
                    <img
                      src={coverImage}
                      alt={country.location}
                      className="aspect-square h-full transform rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute left-[50%] top-[50%] z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                      <h3 className="text-xl font-bold capitalize text-pink">
                        {country.location}
                      </h3>
                      <p className="text-lg font-semibold text-pink">
                        {country.chin}
                      </p>
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

export default ForeignSpotsCollectionContainer;
