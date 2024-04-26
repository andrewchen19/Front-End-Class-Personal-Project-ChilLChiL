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

// react icons
import { FaStar } from "react-icons/fa";

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
      <h2 className="flex justify-between border-b border-gray-300 pb-4 text-2xl font-bold">
        收藏文章
      </h2>

      {isArticleLoading && <p className="mt-8">loading now...</p>}

      {!isArticleLoading && articlesList.length < 1 && (
        <h3 className="mt-8">尚未收藏任何文章...</h3>
      )}

      <div className="mt-8 grid grid-cols-3 gap-x-12 gap-y-8">
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
    </div>
  );
};

export default ArticlesCollectionContainer;
