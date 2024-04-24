import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

const LocalSpotsCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();

  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);
  const [localSpotsList, setLocalSpotsList] = useState<DocumentData[] | []>([]);

  const clickHandler = (id: string, name: string) => {
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
      <h2 className="text-2xl font-bold">收藏浪點: (國內)</h2>

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
                className="w-[200px] cursor-pointer border border-black"
                onClick={() => clickHandler(id, name.eng)}
              >
                <img
                  src={mapImage}
                  alt={name.chin}
                  className="h-[100px] w-full object-cover object-center"
                />
                <div className="p-2">
                  <h3 className="font-semibold">{name.chin}</h3>
                  <h5 className="font-fashioncountry capitalize">{name.eng}</h5>
                  <p className="text-sm">
                    收藏次數:<span className="ml-2">{likes_amount}</span>
                  </p>
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
};

export default LocalSpotsCollectionContainer;
