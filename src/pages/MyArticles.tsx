import React, { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { formatCoverTime } from "../utils";

// firebase
import { db } from "../main";
import { collection, getDocs, DocumentData } from "firebase/firestore";

const MyArticles: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | []>([]);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  const fetchArticlesFromFirebase = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "users", user.id, "my-articles"),
      );
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
    <div className="mx-auto flex w-[90%] max-w-6xl gap-10">
      <nav className="mt-20 w-[150px] shrink-0 px-10">
        <ul className="flex flex-col gap-4 font-notosans text-base">
          <li>
            <NavLink
              to="/profile/my-info"
              className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#968095" : "",
                  borderBottom: isActive ? "1px solid #968095" : "",
                };
              }}
            >
              個人資訊
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile/my-collections"
              className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#968095" : "",
                  borderBottom: isActive ? "1px solid #968095" : "",
                };
              }}
            >
              我的收藏
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile/my-articles"
              className="border-b-transparent border-b hover:border-b-purple-light hover:text-purple-light"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#968095" : "",
                  borderBottom: isActive ? "1px solid #968095" : "",
                };
              }}
            >
              我的文章
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mt-20 w-full px-10">
        <div className="flex items-center justify-between">
          <h2 className="font-notosans text-2xl font-bold">文章列表:</h2>

          <NavLink to="/profile/post-article">
            <button className="items-center rounded-lg bg-purple-light px-2 py-1 font-notosans text-xs text-white">
              新增文章
            </button>
          </NavLink>
        </div>

        {isLoading && <p className="mt-5">loading now...</p>}

        {!isLoading && articlesList.length < 1 && (
          <h3 className="mt-5">尚未有文章~快來撰寫!!</h3>
        )}

        <div className="mt-5 max-w-5xl grid-cols-4 gap-7">
          {!isLoading &&
            articlesList.length > 0 &&
            articlesList.map((article) => {
              const {
                id,
                cover,
                surfingSpot,
                title,
                likes_id,
                tag,
                created_at,
              } = article;
              return (
                <article
                  key={id}
                  className="w-[200px] cursor-pointer border border-black"
                >
                  <img
                    src={cover}
                    alt={surfingSpot}
                    className="h-[100px] w-full object-cover object-center"
                  />
                  <div className="p-2">
                    <h3 className="font-notosans text-xl">{title}</h3>

                    <p className="mt-2">
                      收藏人數:<span>{likes_id.length}</span>
                    </p>

                    <div className="mt-2 flex justify-between">
                      <div className="flex gap-1">
                        <span className="rounded-lg bg-green-bright px-1 text-xs text-white">
                          {tag}
                        </span>
                        <span className="rounded-lg bg-orange-bright px-1  text-xs text-white">
                          {surfingSpot}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatCoverTime(created_at)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MyArticles;
