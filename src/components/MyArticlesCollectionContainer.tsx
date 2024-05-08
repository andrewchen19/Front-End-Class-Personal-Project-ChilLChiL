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

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="mb-10 flex items-center gap-6 border-b border-gray-300 pb-4">
        <h2 className="text-2xl font-bold">我的文章</h2>

        <NavLink to="/profile/post-article">
          <Button
            type="button"
            variant={"purple"}
            size={"sm"}
            className="mt-[4px]"
            onClick={() => dispatch(resetCover())}
          >
            新增文章
          </Button>
        </NavLink>
      </div>

      {(isLoading || !articlesList) && <p className="mt-10">loading now...</p>}

      {!isLoading && articlesList && articlesList.length < 1 && (
        <h3 className="mt-10">尚未有文章，快來撰寫吧~</h3>
      )}

      <div className="mt-10 grid grid-cols-3 gap-x-12 gap-y-10">
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
            );
          })}
      </div>
    </section>
  );
};

export default MyArticlesCollectionContainer;
