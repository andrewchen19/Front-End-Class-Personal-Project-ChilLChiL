import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  formatTime,
  changeSpotName,
  changeTagName,
  htmlToPlainText,
} from "../utils";

// react icons
import { FaStar } from "react-icons/fa";

// firebase
import { db } from "../main";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  limit,
  orderBy,
} from "firebase/firestore";

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
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  const [isArticleLoading, setIsArticleLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | null>(null);

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const fetchArticlesFromFirebase = async (name: string): Promise<void> => {
    const q = query(
      collection(db, "articles"),
      where("surfingSpot", "==", name),
      where("isDeleted", "!=", true),
      orderBy("created_at", "desc"),
      limit(6),
    );
    const querySnapshot = await getDocs(q);
    const articlesArray = querySnapshot.docs.map((doc) => doc.data());
    // console.log(articlesArray);
    setArticlesList(articlesArray);
  };

  useEffect(() => {
    const fetchDataFromFirebase = async (): Promise<void> => {
      if (!name) return;

      setIsArticleLoading(true);

      try {
        await fetchArticlesFromFirebase(name);
      } catch (error) {
        console.log(error);
      }

      setIsArticleLoading(false);
    };

    fetchDataFromFirebase();
  }, []);

  return (
    <section>
      {/* title */}
      <div className="mb-10 border-b border-gray-300 pb-4">
        <h2 className="text-2xl font-bold">相關文章</h2>
      </div>

      {(isArticleLoading || !articlesList) && <p>loading now...</p>}

      {!isArticleLoading && articlesList && articlesList.length < 1 && (
        <h3>尚未有相關的文章...</h3>
      )}

      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent className="-ml-8">
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
                  className="flex flex-grow pl-8 hover:cursor-pointer md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
                          <div className="flex gap-1">
                            <span className="rounded-lg bg-green-bright px-1 text-xs text-white">
                              {changeTagName(tag)}
                            </span>

                            <span className="rounded-lg bg-orange-bright px-1 text-xs text-white">
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
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default RelatedArticlesContainer;
