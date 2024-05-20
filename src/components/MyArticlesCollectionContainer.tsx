import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import starFish from "../assets/icons/starfish.svg";
import LoadingSmall from "./LoadingSmall";

// lottie-react
import Lottie from "lottie-react";
import surfBoy from "../assets/lotties/surf-boy.json";

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
        <div className="flex items-center gap-3">
          <img src={starFish} alt="image" className="h-8 w-8" />
          <h2 className="text-2xl font-bold">我的文章</h2>
        </div>

        {articlesList && articlesList.length > 0 && (
          <Link to="/profile/post-article">
            <Button
              type="button"
              variant={"purple"}
              size={"xs"}
              className="mt-[6px]"
              onClick={() => dispatch(resetCover())}
            >
              新增文章
            </Button>
          </Link>
        )}
      </div>

      {(isLoading || !articlesList) && (
        <div className="mt-11">
          <LoadingSmall />
        </div>
      )}

      {!isLoading && articlesList && articlesList.length < 1 && (
        <div className="flex gap-4">
          <div
            className="h-[180px] w-[180px]"
            style={{ transform: "scaleX(-1)" }}
          >
            <Lottie animationData={surfBoy} loop={true} />
          </div>

          <div className="mt-5">
            <div className="font-sriracha">
              <h3>No any articles yet?</h3>
              <p>Write down some stories now!</p>
            </div>

            <div className="mt-2">
              <Link to="/profile/post-article">
                <Button variant={"purple-hipster"} size={"xs"}>
                  Create Article
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
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
                  className="relative flex flex-grow shadow-xs duration-300 hover:cursor-pointer hover:shadow-lg"
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
                        <div className="flex gap-2">
                          <span className="rounded-lg bg-green px-2 py-1 text-xs tracking-wide text-white">
                            {changeTagName(tag)}
                          </span>

                          <span className="rounded-lg bg-orange px-2 py-1 text-xs tracking-wide text-white">
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

export default MyArticlesCollectionContainer;
