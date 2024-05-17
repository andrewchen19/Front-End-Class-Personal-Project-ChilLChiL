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
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";

const NewbieForeignSpotsContainer: React.FC = () => {
  const navigate = useNavigate();

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

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
      <h2 className="mb-14 flex items-center gap-3 text-nowrap font-sriracha text-2xl font-semibold text-gray-800 md:text-4xl">
        Top Picks for Beginner
        <img src={travel} alt="travel" className="h-8 w-8 md:h-10 md:w-10" />
      </h2>

      {isSpotLoading && (
        <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-[420px] rounded-lg"></div>
        </div>
      )}

      <Carousel
        className="w-[85vw] md:w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent className="ml-0 md:-ml-5">
          {!isSpotLoading &&
            spotsList.length > 1 &&
            spotsList.map((spot) => {
              const { id, country, coverImage } = spot;
              return (
                <CarouselItem
                  key={id}
                  className="overflow-hidden pl-0 hover:cursor-pointer md:basis-1/2 md:pl-5 lg:basis-1/3"
                  onClick={() => spotHandler(country.eng, id)}
                >
                  <Card className="border-none">
                    <CardContent className="group relative h-[420px]">
                      {/* overlay */}
                      <div className="absolute z-10 h-full w-full bg-black/15 group-hover:bg-black/50"></div>

                      <img
                        src={coverImage}
                        alt={country.location}
                        className="h-full w-full transform rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute left-[50%] top-[50%] z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                        <h3 className="text-nowrap text-[24px] font-bold capitalize text-white">
                          {country.location}
                        </h3>
                        <p className="text-lg font-semibold text-white">
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
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        )}
      </Carousel>
    </section>
  );
};

export default NewbieForeignSpotsContainer;
