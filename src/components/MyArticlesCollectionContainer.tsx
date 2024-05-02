import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { resetCover } from "../features/article/articleSlice";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | null>(null);

  const navigate = useNavigate();

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const fetchArticlesFromFirebase = async (): Promise<void> => {
    if (!user) return;

    setIsLoading(true);

    try {
      const q = query(
        collection(db, "articles"),
        where("authorId", "==", user.id),
        where("isDeleted", "!=", true),
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
      <div className="flex items-center gap-6 border-b border-gray-300 pb-4">
        <h2 className="text-2xl font-bold">我的文章</h2>

        <NavLink to="/profile/post-article">
          <button
            className="btn-purple mt-[6px] sm:btn-xs"
            onClick={() => dispatch(resetCover())}
          >
            新增文章
          </button>
        </NavLink>
      </div>

      {(isLoading || !articlesList) && <p className="mt-8">loading now...</p>}

      {!isLoading && articlesList && articlesList.length < 1 && (
        <h3 className="mt-8">尚未有文章，快來撰寫吧~</h3>
      )}

      <div className="mt-8 grid grid-cols-3 gap-x-12 gap-y-8">
        {!isLoading &&
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

export default MyArticlesCollectionContainer;
