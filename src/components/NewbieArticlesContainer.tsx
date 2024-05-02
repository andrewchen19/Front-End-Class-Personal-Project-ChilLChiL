import React, { useEffect, useState } from "react";
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
  getDocs,
  collection,
  where,
  orderBy,
  limit,
  query,
  DocumentData,
} from "firebase/firestore";

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
      <h2 className="border-b border-gray-300 pb-4 text-2xl font-bold">
        新手必看
      </h2>

      {(isArticleLoading || !articlesList) && (
        <p className="mt-8">loading now...</p>
      )}

      {!isArticleLoading && articlesList && articlesList.length < 1 && (
        <h3 className="mt-8">尚未有任何文章...</h3>
      )}

      <div className="mt-8 grid grid-cols-3 gap-x-12 gap-y-8">
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
              <article
                key={id}
                className="card shadow-xl transition-all duration-300 hover:cursor-pointer hover:shadow-2xl"
                onClick={() => articleHandler(id)}
              >
                <img
                  src={cover}
                  alt={surfingSpot}
                  className="h-[150px] w-full rounded-t-2xl object-cover object-center"
                />

                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-xl font-semibold capitalize">{title}</h3>

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
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default NewbieArticlesContainer;
