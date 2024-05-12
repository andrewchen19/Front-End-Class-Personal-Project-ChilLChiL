import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatTime,
  changeSpotName,
  changeTagName,
  htmlToPlainText,
} from "../utils";
import fire from "../assets/icons/fire.svg";

// react icons
import { FaStar } from "react-icons/fa";

// firebase
import { db } from "../main";
import {
  getDocs,
  collection,
  where,
  orderBy,
  limit,
  query,
  DocumentData,
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

const HeatArticlesContainer: React.FC = () => {
  const navigate = useNavigate();

  const [isArticleLoading, setIsArticleLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | null>(null);

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  async function getArticlesFromFirebase(): Promise<void> {
    const articlesCollectionRef = collection(db, "articles");

    // order and limit
    const q = query(
      articlesCollectionRef,
      where("isDeleted", "!=", true),
      orderBy("likes_amount", "desc"),
      limit(6),
    );

    const querySnapshot = await getDocs(q);
    const articlesArray = querySnapshot.docs.map((doc) => doc.data());
    setArticlesList(articlesArray);
  }

  const fetchDataFromFirebase = async (): Promise<void> => {
    setIsArticleLoading(true);

    try {
      await getArticlesFromFirebase();
    } catch (error) {
      console.log(error);
    }

    setIsArticleLoading(false);
  };

  useEffect(() => {
    fetchDataFromFirebase();
  }, []);

  return (
    <section>
      {/* title */}
      <div className="mb-10 border-b border-gray-300 pb-4">
        <div className="flex items-center gap-3">
          <img src={fire} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">熱門文章</h2>
        </div>
      </div>

      {(isArticleLoading || !articlesList) && (
        <div className="flex w-full gap-8">
          <div className="skeleton h-[240px] w-1/3 rounded-lg"></div>
          <div className="skeleton  h-[512px] w-1/3 rounded-lg"></div>
          <div className="skeleton  h-[240px] w-1/3 rounded-lg"></div>
        </div>
      )}

      {!isArticleLoading && articlesList && articlesList.length < 1 && (
        <h3>尚未有任何文章...</h3>
      )}

      {/* {!isArticleLoading && (
        <Carousel
          className="w-full"
          opts={{
            align: "start",
          }}
        >
          <CarouselContent className="-ml-8">
            {articlesList &&
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
                    className="flex flex-grow pl-8 hover:cursor-pointer md:basis-1/2 lg:basis-1/3"
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
                              <span className="bg-green rounded-lg px-2 py-1 text-xs tracking-wide text-white">
                                {changeTagName(tag)}
                              </span>

                              <span className="bg-orange rounded-lg px-2 py-1 text-xs tracking-wide text-white">
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
      )} */}

      {!isArticleLoading && articlesList && articlesList.length > 0 && (
        <div className="w-full">
          {/* {articlesList.map((article) => {
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
              <div
                key={id}
                className="flex flex-grow hover:cursor-pointer md:basis-1/2 lg:basis-1/3"
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
                          <span className="bg-green rounded-lg px-2 py-1 text-xs tracking-wide text-white">
                            {changeTagName(tag)}
                          </span>

                          <span className="bg-orange rounded-lg px-2 py-1 text-xs tracking-wide text-white">
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
              </div>
            );
          })} */}

          <div className="flex gap-8">
            <div className="flex w-1/3 flex-col gap-8">
              <div
                className="group h-[240px] hover:cursor-pointer"
                onClick={() => articleHandler(articlesList[1].id)}
              >
                <Card className="flex flex-grow border-none">
                  <CardContent className="relative flex h-[240px] w-full flex-col">
                    <img
                      src={articlesList[1].cover}
                      alt={articlesList[1].surfingSpot}
                      className="h-full w-full object-cover object-center duration-300 group-hover:scale-105"
                    />

                    {/* overlay */}
                    <div className="absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black"></div>

                    <div className="absolute bottom-0 left-0 z-20 w-full flex-col px-4 pb-3">
                      {/* title */}
                      <h3 className="mb-3 text-xl font-semibold capitalize text-white">
                        {articlesList[1].title}
                      </h3>

                      {/* tags */}
                      <div className="mb-2 flex gap-2">
                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeTagName(articlesList[1].tag)}
                        </span>

                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeSpotName(articlesList[1].surfingSpot)}
                        </span>
                      </div>

                      {/* date & star */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white">
                          {formatTime(articlesList[1].created_at)}
                        </p>

                        <div className="flex items-center gap-1">
                          <FaStar className=" text-yellow" />
                          <span className="text-white">
                            {articlesList[1].likes_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div
                className="group h-[240px] hover:cursor-pointer"
                onClick={() => articleHandler(articlesList[2].id)}
              >
                <Card className="flex flex-grow border-none">
                  <CardContent className="relative flex h-[240px] w-full flex-col">
                    <img
                      src={articlesList[2].cover}
                      alt={articlesList[2].surfingSpot}
                      className="h-full w-full object-cover object-center duration-300 group-hover:scale-105"
                    />

                    {/* overlay */}
                    <div className="absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black"></div>

                    <div className="absolute bottom-0 left-0 z-20 w-full flex-col px-4 pb-3">
                      {/* title */}
                      <h3 className="mb-3 text-xl font-semibold capitalize text-white">
                        {articlesList[2].title}
                      </h3>

                      {/* tags */}
                      <div className="mb-2 flex gap-2">
                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeTagName(articlesList[2].tag)}
                        </span>

                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeSpotName(articlesList[2].surfingSpot)}
                        </span>
                      </div>

                      {/* date & star */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white">
                          {formatTime(articlesList[2].created_at)}
                        </p>

                        <div className="flex items-center gap-1">
                          <FaStar className=" text-yellow" />
                          <span className="text-white">
                            {articlesList[2].likes_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex w-1/3 flex-grow items-stretch">
              <div
                className="group h-[512px] hover:cursor-pointer"
                onClick={() => articleHandler(articlesList[0].id)}
              >
                <Card className="flex flex-grow border-none">
                  <CardContent className="relative flex h-[512px] w-full flex-col">
                    <img
                      src={articlesList[0].cover}
                      alt={articlesList[0].surfingSpot}
                      className="h-full w-full object-cover object-center duration-300 group-hover:scale-105"
                    />

                    {/* overlay */}
                    <div className="absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black"></div>

                    <div className="absolute bottom-0 left-0 z-20 w-full flex-col px-4 pb-3">
                      {/* title */}
                      <h3 className="mb-3 text-xl font-semibold capitalize text-white">
                        {articlesList[0].title}
                      </h3>

                      {/* tags */}
                      <div className="mb-2 flex gap-2">
                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeTagName(articlesList[0].tag)}
                        </span>

                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeSpotName(articlesList[0].surfingSpot)}
                        </span>
                      </div>

                      {/* date & star */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white">
                          {formatTime(articlesList[0].created_at)}
                        </p>

                        <div className="flex items-center gap-1">
                          <FaStar className=" text-yellow" />
                          <span className="text-white">
                            {articlesList[0].likes_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex w-1/3 flex-col gap-8">
              <div
                className="group h-[240px] hover:cursor-pointer"
                onClick={() => articleHandler(articlesList[3].id)}
              >
                <Card className="flex flex-grow border-none">
                  <CardContent className="relative flex h-[240px] w-full flex-col">
                    <img
                      src={articlesList[3].cover}
                      alt={articlesList[3].surfingSpot}
                      className="h-full w-full object-cover object-center duration-300 group-hover:scale-105"
                    />

                    {/* overlay */}
                    <div className="absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black"></div>

                    <div className="absolute bottom-0 left-0 z-20 w-full flex-col px-4 pb-3">
                      {/* title */}
                      <h3 className="mb-3 text-xl font-semibold capitalize text-white">
                        {articlesList[3].title}
                      </h3>

                      {/* tags */}
                      <div className="mb-2 flex gap-2">
                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeTagName(articlesList[3].tag)}
                        </span>

                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeSpotName(articlesList[3].surfingSpot)}
                        </span>
                      </div>

                      {/* date & star */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white">
                          {formatTime(articlesList[3].created_at)}
                        </p>

                        <div className="flex items-center gap-1">
                          <FaStar className=" text-yellow" />
                          <span className="text-white">
                            {articlesList[3].likes_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div
                className="group h-[240px] hover:cursor-pointer"
                onClick={() => articleHandler(articlesList[4].id)}
              >
                <Card className="flex flex-grow border-none">
                  <CardContent className="relative flex h-[240px] w-full flex-col">
                    <img
                      src={articlesList[4].cover}
                      alt={articlesList[4].surfingSpot}
                      className="h-full w-full object-cover object-center duration-300 group-hover:scale-105"
                    />

                    {/* overlay */}
                    <div className="absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black"></div>

                    <div className="absolute bottom-0 left-0 z-20 w-full flex-col px-4 pb-3">
                      {/* title */}
                      <h3 className="mb-3 text-xl font-semibold capitalize text-white">
                        {articlesList[4].title}
                      </h3>

                      {/* tags */}
                      <div className="mb-2 flex gap-2">
                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeTagName(articlesList[4].tag)}
                        </span>

                        <span className="rounded-lg text-xs tracking-wide text-white">
                          # {changeSpotName(articlesList[4].surfingSpot)}
                        </span>
                      </div>

                      {/* date & star */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white">
                          {formatTime(articlesList[4].created_at)}
                        </p>

                        <div className="flex items-center gap-1">
                          <FaStar className=" text-yellow" />
                          <span className="text-white">
                            {articlesList[4].likes_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeatArticlesContainer;
