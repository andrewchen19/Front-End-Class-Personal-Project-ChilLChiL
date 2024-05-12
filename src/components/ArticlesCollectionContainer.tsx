import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import {
  formatTime,
  changeSpotName,
  changeTagName,
  htmlToPlainText,
} from "../utils";
import jellyfish from "../assets/icons/jellyfish.svg";
import LoadingSmall from "./LoadingSmall";

// react icons
import { FaStar } from "react-icons/fa";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

// shadcn
import { Card, CardContent } from "@/components/ui/card";

const ArticlesCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();

  const [isArticleLoading, setIsArticleLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | null>(null);

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const fetchArticlesIdFromFirebase = async (): Promise<
    string[] | undefined
  > => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().articlesCollection;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArticlesDataFromFirebase = async (
    data: string[],
  ): Promise<void> => {
    const articlesData: DocumentData[] = [];

    for (const id of data) {
      try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && !docSnap.data().isDeleted) {
          articlesData.push(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    }

    setArticlesList(articlesData);
  };

  const fetchDataFromFirebase = async (): Promise<void> => {
    setIsArticleLoading(true);

    try {
      const data = await fetchArticlesIdFromFirebase();
      if (!data) return;
      await fetchArticlesDataFromFirebase(data);
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
      <div className="mb-10 border-b border-gray-300 pb-4">
        <div className="flex items-center gap-3">
          <img src={jellyfish} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">收藏文章</h2>
        </div>
      </div>

      {/* {(isArticleLoading || !articlesList) && (
        <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-[360px] rounded-lg"></div>
        </div>
      )} */}

      {(isArticleLoading || !articlesList) && <LoadingSmall />}

      {!isArticleLoading && articlesList && articlesList.length < 1 && (
        <h3>尚未收藏任何文章...</h3>
      )}

      {!isArticleLoading && (
        <div className="grid grid-cols-3 gap-x-12 gap-y-10">
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
                <Card
                  key={id}
                  className="shadow-xs relative flex flex-grow duration-300 hover:cursor-pointer hover:shadow-lg"
                  onClick={() => articleHandler(id)}
                >
                  <CardContent className="flex h-full w-full flex-col">
                    <img
                      src={cover}
                      alt={surfingSpot}
                      className="h-[150px] w-full object-cover object-center"
                    />

                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="text-xl font-semibold capitalize">
                        {title}
                      </h3>

                      <p className="mb-5 mt-3 line-clamp-3 text-base text-gray-600">
                        {htmlToPlainText(content)}
                      </p>

                      <div className="mt-auto">
                        <div className="flex gap-1">
                          <span className="bg-green rounded-lg px-2 py-1 text-xs tracking-wide text-white">
                            {changeTagName(tag)}
                          </span>

                          <span className="bg-orange rounded-lg px-2 py-1  text-xs tracking-wide  text-white">
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
              );
            })}
        </div>
      )}
    </section>
  );
};

export default ArticlesCollectionContainer;
