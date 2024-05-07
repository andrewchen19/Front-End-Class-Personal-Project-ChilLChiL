import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import travel from "../assets/icons/travel.svg";

// firebase
import { db } from "../main";
import { collection, query, getDocs, DocumentData } from "firebase/firestore";

// shadcn
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const NewbieForeignSpotsContainer: React.FC = () => {
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
      if (doc.data().category.includes("beginner")) {
        spotsArray.push(data);
      }
    });

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
      <h2 className="mb-14 flex items-center gap-3 font-sriracha text-4xl font-semibold text-gray-800">
        Top Picks for Beginner
        <img src={travel} alt="travel" className="h-8 w-8" />
      </h2>

      {isSpotLoading && <p>loading now...</p>}

      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-10">
          {!isSpotLoading &&
            spotsList.length > 1 &&
            spotsList.map((spot) => {
              const { id, country, coverImage } = spot;
              return (
                <CarouselItem
                  key={id}
                  className="overflow-hidden pl-10 hover:cursor-pointer md:basis-1/2 lg:basis-1/3"
                  onClick={() => spotHandler(country.eng, id)}
                >
                  <Card className="border-none">
                    <CardContent className="relative h-[420px]">
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
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
        </CarouselContent>

        {!isSpotLoading && spotsList && spotsList.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default NewbieForeignSpotsContainer;
