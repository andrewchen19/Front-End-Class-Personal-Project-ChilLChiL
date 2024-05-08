import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";

// react-icons
import { FaStar } from "react-icons/fa";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

// shadcn
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
      <h2 className="text-2xl font-bold">國內浪點</h2>

      {(isLocalLoading || !localSpotsList) && (
        <p className="mt-10">loading now...</p>
      )}

      {!isLocalLoading && localSpotsList && localSpotsList.length < 1 && (
        <h3 className="mt-10">尚未收藏浪點...</h3>
      )}

      <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-10">
        {!isLocalLoading &&
          localSpotsList &&
          localSpotsList.length > 0 &&
          localSpotsList.map((spot) => {
            const { id, name, mapImage, likes_amount } = spot;
            return (
              <Card
                key={id}
                className="shadow-xs relative flex flex-grow duration-300 hover:cursor-pointer hover:shadow-lg"
                onClick={() => spotHandler(name.eng, id)}
              >
                <CardContent className="flex h-full w-full flex-col">
                  <img
                    src={mapImage}
                    alt={name.chin}
                    className="h-[150px] w-full object-cover object-center"
                  />

                  <div className="flex flex-grow flex-col p-3">
                    <h3 className="font-semibold">{name.chin}</h3>

                    <div className="mt-10 flex justify-between">
                      <h5 className="font-fashioncountry text-lg capitalize text-turquoise">
                        {name.eng}
                      </h5>
                      <div className="flex items-center gap-1">
                        <FaStar className=" text-yellow" />
                        <span>{likes_amount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </section>
  );
};

export default LocalSpotsCollectionContainer;
