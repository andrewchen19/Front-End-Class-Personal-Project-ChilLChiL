import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// firebase
import { db } from "../main";
import { collection, query, getDocs, DocumentData } from "firebase/firestore";

const MonthForeignSpotsContainer: React.FC = () => {
  const navigate = useNavigate();

  const [isSpotLoading, setIsSpotLoading] = useState<boolean>(false);
  const [spotsList, setSpotsList] = useState<DocumentData[] | []>([]);

  const spotHandler = (name: string, id: string) => {
    navigate(`/foreign-spots/${name}/${id}`);
  };

  const fetchSpotsFromFirebase = async (): Promise<void> => {
    const q = query(collection(db, "foreign-spots"));
    const querySnapshot = await getDocs(q);
    let spotsArray: DocumentData[] = [];
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data() as DocumentData;
      if (doc.data().category.includes("may")) {
        spotsArray.push(data);
      }
    });

    console.log(spotsArray);

    setSpotsList(spotsArray);
  };

  useEffect(() => {
    const fetchDataFromFirebase = async (): Promise<void> => {
      setIsSpotLoading(true);

      try {
        await fetchSpotsFromFirebase();
      } catch (error) {
        console.log(error);
      }

      setIsSpotLoading(false);
    };

    fetchDataFromFirebase();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold">五月推薦</h2>

      {isSpotLoading && <p className="mt-5">loading now...</p>}

      <div className="mx-auto mt-5 grid grid-cols-2 gap-10">
        {!isSpotLoading &&
          spotsList.length > 1 &&
          spotsList.map((spot) => {
            const { id, country, coverImage } = spot;
            return (
              <article
                key={id}
                className="relative h-[420px] overflow-hidden rounded-lg hover:cursor-pointer"
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

export default MonthForeignSpotsContainer;
