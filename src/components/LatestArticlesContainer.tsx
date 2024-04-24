import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime, changeSpotName, changeTagName } from "../utils";

// firebase
import { db } from "../main";
import {
  getDocs,
  collection,
  orderBy,
  limit,
  query,
  DocumentData,
} from "firebase/firestore";

const LatestArticlesContainer: React.FC = () => {
  const navigate = useNavigate();

  const [isArticleLoading, setIsArticleLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | []>([]);

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  async function getArticlesFromFirebase(): Promise<void> {
    const articlesCollectionRef = collection(db, "articles");

    // order and limit
    const q = query(
      articlesCollectionRef,
      orderBy("created_at", "desc"),
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
      <h2 className="text-2xl font-bold">最新發布:</h2>

      {isArticleLoading && <p className="mt-5">loading now...</p>}

      {!isArticleLoading && articlesList.length < 1 && (
        <h3 className="mt-5">尚未有任何文章...</h3>
      )}

      <div className="mt-5 grid grid-cols-4">
        {!isArticleLoading &&
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
            } = article;
            return (
              <article
                key={id}
                className="w-[200px] cursor-pointer border border-black"
                onClick={() => articleHandler(id)}
              >
                <img
                  src={cover}
                  alt={surfingSpot}
                  className="h-[100px] w-full object-cover object-center"
                />
                <div className="p-2">
                  <h3 className="text-xl">{title}</h3>

                  <p className="mt-2">
                    收藏人數:<span>{likes_amount}</span>
                  </p>

                  <div className="mt-2 flex justify-between">
                    <div className="flex gap-1">
                      <span className="rounded-lg bg-green-bright px-1 text-xs text-white">
                        {changeTagName(tag)}
                      </span>
                      <span className="rounded-lg bg-orange-bright px-1  text-xs text-white">
                        {changeSpotName(surfingSpot)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatTime(created_at)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default LatestArticlesContainer;
