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
  const [foreignSpotsList, setForeignSpotsList] = useState<
    DocumentData[] | null
  >(null);

  const spotHandler = (name: string, id: string) => {
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
    <section>
      <h2 className="text-2xl font-bold">國外浪點</h2>

      {(isForeignLoading || !foreignSpotsList) && (
        <p className="mt-8">loading now...</p>
      )}

      {!isForeignLoading && foreignSpotsList && foreignSpotsList.length < 1 && (
        <h3 className="mt-8">尚未收藏浪點...</h3>
      )}

      <div className="mt-8 grid grid-cols-3 gap-x-12 gap-y-8">
        {!isForeignLoading &&
          foreignSpotsList &&
          foreignSpotsList.length > 0 &&
          foreignSpotsList.map((spot) => {
            const { id, country, coverImage } = spot;
            return (
              <article
                key={id}
                className="relative h-[220px] overflow-hidden rounded-lg hover:cursor-pointer"
                onClick={() => spotHandler(country.eng, id)}
              >
                <img
                  src={coverImage}
                  alt={country.location}
                  className="h-full w-full transform rounded-lg object-cover object-center transition-transform duration-500 hover:scale-110"
                />

                <div className="absolute left-[50%] top-[50%] z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                  <h3 className="text-xl font-bold capitalize text-pink">
                    {country.location}
                  </h3>
                  <p className="text-lg font-semibold text-pink">
                    {country.chin}
                  </p>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default ForeignSpotsCollectionContainer;
