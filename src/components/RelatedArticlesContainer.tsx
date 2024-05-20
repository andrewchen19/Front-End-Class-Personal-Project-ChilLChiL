import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  formatTime,
  changeSpotName,
  changeTagName,
  htmlToPlainText,
} from "../utils";
import flower from "../assets/icons/flower.svg";
import useGetArticlesFromFirestore from "@/utils/hooks/useGetArticlesFromFirestore";

// react icons
import { FaStar } from "react-icons/fa";

// shadcn
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

const RelatedArticlesContainer: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  if (!name) return;

  // custom hook
  const { isLoading: isArticleLoading, articlesList } =
    useGetArticlesFromFirestore({
      name,
    });

  return (
    <section className="w-full">
      {/* title */}
      <div className="mb-10 border-b border-gray-300 pb-4">
        <h2 className="text-2xl font-bold"></h2>
        <div className="flex items-center gap-3">
          <img src={flower} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">相關文章</h2>
        </div>
      </div>

      {(isArticleLoading || !articlesList) && (
        <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="skeleton h-[360px] rounded-lg"></div>
        </div>
      )}

      {!isArticleLoading && articlesList && articlesList.length < 1 && (
        <h3>尚未有相關的文章...</h3>
      )}

      <Carousel
        className="w-[85vw] md:w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent className="md:-ml-8">
          {!isArticleLoading &&
            articlesList &&
            articlesList.length > 0 &&
            articlesList.map((article) => {
              const {
                id,
                cover,
                surfingSpot,
                title,
                likes_amount,
                tag,
                created_at,
                content,
              } = article;
              return (
                <CarouselItem
                  key={id}
                  className="flex flex-grow hover:cursor-pointer md:basis-1/2 md:pl-8 lg:basis-1/3 xl:basis-1/4"
                  onClick={() => articleHandler(id)}
                >
                  <Card className="flex flex-grow border-gray-900">
                    <CardContent className="flex h-full w-full flex-col">
                      <img
                        src={cover}
                        alt={surfingSpot}
                        className="h-[150px] w-full object-cover object-center"
                      />
                      <div className="flex flex-grow flex-col p-3">
                        <h3 className="text-xl font-semibold capitalize">
                          {title}
                        </h3>

                        <p className="mb-5 mt-3 line-clamp-3 text-base text-gray-600">
                          {htmlToPlainText(content)}
                        </p>

                        <div className="mt-auto">
                          <div className="flex gap-2">
                            <span className="rounded-lg bg-green px-2 py-1 text-xs tracking-wide text-white">
                              {changeTagName(tag)}
                            </span>

                            <span className="rounded-lg bg-orange px-2 py-1 text-xs tracking-wide text-white">
                              {changeSpotName(surfingSpot)}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              {formatTime(created_at)}
                            </p>

                            <div className="flex items-center gap-1">
                              <FaStar className=" text-yellow" />
                              <span>{likes_amount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
        </CarouselContent>

        {!isArticleLoading && articlesList && articlesList.length > 0 && (
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        )}
      </Carousel>
    </section>
  );
};

export default RelatedArticlesContainer;
