import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

const ForeignSpotsCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();

  const [isForeignLoading, setIsForeignLoading] = useState<boolean>(false);
  const [foreignSpotsList, setForeignSpotsList] = useState<DocumentData[] | []>(
    [],
  );

  const clickHandler = (id: string, name: string) => {
    navigate(`/foreign-spots/${name}/${id}`);
  };

  const fetchForeignSpotsIdFromFirebase = async (): Promise<
    string[] | undefined
  > => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().foreignSpotsCollection;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchForeignSpotsDataFromFirebase = async (
    data: string[],
  ): Promise<void> => {
    const foreignSpotsData: DocumentData[] = [];

    for (const id of data) {
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

  const fetchDataFromFirebase = async (): Promise<void> => {
    setIsForeignLoading(true);

    try {
      const data = await fetchForeignSpotsIdFromFirebase();
      if (!data) return;
      await fetchForeignSpotsDataFromFirebase(data);
    } catch (error) {
      console.log(error);
    }

    setIsForeignLoading(false);
  };

  useEffect(() => {
    fetchDataFromFirebase();
  }, []);

  return (
    <div>
      <h2 className="font-notosans text-2xl font-bold">收藏浪點: (國外)</h2>

      {isForeignLoading && <p className="mt-5">loading now...</p>}

      {!isForeignLoading && foreignSpotsList.length < 1 && (
        <h3 className="mt-5">尚未收藏浪點...</h3>
      )}

      <div className="mt-5 grid grid-cols-4">
        {!isForeignLoading &&
          foreignSpotsList.length > 0 &&
          foreignSpotsList.map((spot) => {
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
                  <h3 className="font-notosans">{name.chin}</h3>
                  <h5 className="font-fashioncountry capitalize">{name.eng}</h5>
                  <p className="font-notosans text-sm">
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

export default ForeignSpotsCollectionContainer;
