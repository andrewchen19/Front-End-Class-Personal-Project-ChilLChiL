import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";

// react-icons
import { FaStar } from "react-icons/fa";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

const LocalSpotsCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();

  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);
  const [localSpotsList, setLocalSpotsList] = useState<DocumentData[] | []>([]);

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
    <div>
      <h2 className="text-2xl font-bold">國內浪點</h2>

      {isLocalLoading && <p className="mt-5">loading now...</p>}

      {!isLocalLoading && localSpotsList.length < 1 && (
        <h3 className="mt-5">尚未收藏浪點...</h3>
      )}

      <div className="mt-5 grid grid-cols-4">
        {!isLocalLoading &&
          localSpotsList.length > 0 &&
          localSpotsList.map((spot) => {
            const { id, name, mapImage, likes_amount } = spot;
            return (
              <article
                key={id}
                className="card shadow-xl transition-all duration-300 hover:cursor-pointer hover:shadow-2xl"
                onClick={() => spotHandler(name.eng, id)}
              >
                <img
                  src={mapImage}
                  alt={name.chin}
                  className="h-[150px] w-full rounded-t-2xl object-cover object-center"
                />

                <div className="flex flex-col gap-5 p-3">
                  <h3 className="font-semibold">{name.chin}</h3>

                  <div className="flex justify-between">
                    <h5 className="font-fashioncountry capitalize text-turquoise">
                      {name.eng}
                    </h5>
                    <div className="flex items-center gap-1">
                      <FaStar className=" text-yellow" />
                      <span>{likes_amount}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
};

export default LocalSpotsCollectionContainer;
