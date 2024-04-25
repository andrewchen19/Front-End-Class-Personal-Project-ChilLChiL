import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { formatTime, changeSpotName, changeTagName } from "../utils";

// firebase
import { db } from "../main";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  DocumentData,
} from "firebase/firestore";

const MyArticlesCollectionContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | []>([]);

  const navigate = useNavigate();

  const clickHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const fetchArticlesFromFirebase = async (): Promise<void> => {
    if (!user) return;

    setIsLoading(true);

    try {
      const q = query(
        collection(db, "articles"),
        where("authorId", "==", user.id),
        orderBy("created_at", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const articlesArray = querySnapshot.docs.map((doc) => doc.data());
      setArticlesList(articlesArray);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticlesFromFirebase();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-notosans text-2xl font-bold">我的文章</h2>

        <NavLink to="/profile/post-article">
          <button className="btn-purple">新增文章</button>
        </NavLink>
      </div>

      {isLoading && <p className="mt-5">loading now...</p>}

      {!isLoading && articlesList.length < 1 && (
        <h3 className="mt-5">尚未有文章~快來撰寫!!</h3>
      )}

      <div className="mt-5 grid grid-cols-4">
        {!isLoading &&
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
                onClick={() => clickHandler(id)}
              >
                <img
                  src={cover}
                  alt={surfingSpot}
                  className="h-[100px] w-full object-cover object-center"
                />
                <div className="p-2">
                  <h3 className="font-notosans text-xl">{title}</h3>

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

export default MyArticlesCollectionContainer;
