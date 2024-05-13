import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime, changeSpotName, changeTagName } from "../utils";
import light from "../assets/icons/light-bulb.svg";

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
import { Card, CardContent } from "@/components/ui/card";

const NewbieArticlesContainer: React.FC = () => {
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
      where("tag", "==", "knowledge"),
      where("isDeleted", "!=", true),
      orderBy("likes_amount", "desc"),
      limit(5),
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
          <img src={light} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">新手必看</h2>
        </div>
      </div>

      {(isArticleLoading || !articlesList) && (
        <div className="flex w-full gap-8">
          <div className="skeleton h-[240px] w-1/3 rounded-lg"></div>
          <div className="skeleton h-[512px] w-1/3 rounded-lg"></div>
          <div className="skeleton h-[240px] w-1/3 rounded-lg"></div>
        </div>
      )}

      {!isArticleLoading && articlesList && articlesList.length < 1 && (
        <h3>尚未有任何文章...</h3>
      )}

      {!isArticleLoading && articlesList && articlesList.length > 0 && (
        <div className="w-full">
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

export default NewbieArticlesContainer;
