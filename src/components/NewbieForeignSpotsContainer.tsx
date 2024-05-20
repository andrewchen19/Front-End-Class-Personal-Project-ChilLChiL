import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import travel from "../assets/icons/travel.svg";
import UseGetDocsFromFirestore from "@/utils/hooks/useGetDocsFromFirestore";

// firebase
import { DocumentData } from "firebase/firestore";

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

  const [spotsList, setSpotsList] = useState<DocumentData[] | []>([]);

  const spotHandler = (name: string, id: string) => {
    navigate(`/foreign-spots/${name}/${id}`);
  };

  // custom hook
  const { isLoading, data: spotsArray } = UseGetDocsFromFirestore({
    path: "foreign-spots",
  });

  useEffect(() => {
    let newSpotsArray: DocumentData[] = [];
    spotsArray?.forEach((item) => {
      if (item.category.includes("beginner")) {
        newSpotsArray.push(item);
      }
    });

    setSpotsList(newSpotsArray);
  }, [isLoading]);

  return (
    <section>
      <h2 className="mb-14 flex items-center gap-3 text-nowrap font-sriracha text-2xl font-semibold text-gray-800 md:text-4xl">
        Top Picks for Beginner
        <img src={travel} alt="travel" className="h-8 w-8 md:h-10 md:w-10" />
      </h2>

      {isLoading && (
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
          {!isLoading &&
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

        {!isLoading && spotsList && spotsList.length > 1 && (
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
