import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { formatTime, changeSpotName, changeTagName } from "../utils";

// firebase
import { db } from "../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

const ArticlesCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();

  const [isArticleLoading, setIsArticleLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | []>([]);

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
        if (docSnap.exists()) {
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
    <div>
      <h2 className="font-notosans text-2xl font-bold">收藏文章</h2>

      {isArticleLoading && <p className="mt-5">loading now...</p>}

      {!isArticleLoading && articlesList.length < 1 && (
        <h3 className="mt-5">尚未收藏文章...</h3>
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
    </div>
  );
};

export default ArticlesCollectionContainer;
