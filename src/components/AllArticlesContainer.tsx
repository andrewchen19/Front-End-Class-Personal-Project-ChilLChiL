import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatTime,
  changeSpotName,
  changeTagName,
  htmlToPlainText,
} from "../utils";

// react icons
import { FaStar } from "react-icons/fa";
import { BsFillGridFill, BsList } from "react-icons/bs";

// firebase
import { db } from "../main";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  endBefore,
  limitToLast,
  getDocs,
  DocumentData,
  where,
} from "firebase/firestore";

const AllArticlesContainer: React.FC = () => {
  const navigate = useNavigate();

  const [isArticleLoading, setIsArticleLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | null>(null);
  const [showPagination, setShowPagination] = useState<boolean>(false);
  const [allPage, setAllPage] = useState<number>(1);
  const [nowPage, setNowPage] = useState<number>(1);
  const [firstDocument, setFirstDocument] = useState<DocumentData | null>(null);
  const [lastDocument, setLastDocument] = useState<DocumentData | null>(null);
  const [layout, setLayout] = useState("grid");
  const [tag, setTag] = useState<string>("all");
  const [surfingSpot, setSurfingSpot] = useState<string>("all");

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const prevHandler = async () => {
    const articlesCollectionRef = collection(db, "articles");

    // get the prev 10 documents
    const prev = query(
      articlesCollectionRef,
      orderBy("created_at"),
      endBefore(firstDocument),
      limitToLast(9),
    );

    const documentSnapshots = await getDocs(prev);
    const articlesArray = documentSnapshots.docs.map((doc) => doc.data());
    setArticlesList(articlesArray);

    const firstVisible = documentSnapshots.docs[0];
    setFirstDocument(firstVisible);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocument(lastVisible);
    setNowPage(nowPage - 1);
  };

  const nextHandler = async () => {
    const articlesCollectionRef = collection(db, "articles");

    // get the next 10 documents
    const next = query(
      articlesCollectionRef,
      orderBy("created_at"),
      startAfter(lastDocument),
      limit(9),
    );

    const documentSnapshots = await getDocs(next);
    const articlesArray = documentSnapshots.docs.map((doc) => doc.data());
    setArticlesList(articlesArray);

    const firstVisible = documentSnapshots.docs[0];
    setFirstDocument(firstVisible);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocument(lastVisible);
    setNowPage(nowPage + 1);
  };

  const formHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (tag === "all" && surfingSpot === "all") {
      getArticlesFromFirebase();
    }
    if (tag !== "all" && surfingSpot === "all") {
      getTagArticlesFromFirebase(tag);
    }
    if (tag === "all" && surfingSpot !== "all") {
      getSurfingSpotArticlesFromFirebase(surfingSpot);
    }
    if (tag !== "all" && surfingSpot !== "all") {
      getTagAndSurfingSpotArticlesFromFirebase(tag, surfingSpot);
    }
  };

  const resetHandler = async (): Promise<void> => {
    setTag("all");
    setSurfingSpot("all");
    setNowPage(1);
    getArticlesFromFirebase();
  };

  async function getArticlesFromFirebase(): Promise<void> {
    const articlesCollectionRef = collection(db, "articles");

    // check numbers of articles
    const q = query(articlesCollectionRef);
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 9) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 9));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    const first = query(articlesCollectionRef, orderBy("created_at"), limit(9));
    const documentSnapshots = await getDocs(first);
    const articlesArray = documentSnapshots.docs.map((doc) => doc.data());
    setArticlesList(articlesArray);

    const firstVisible = documentSnapshots.docs[0];
    setFirstDocument(firstVisible);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocument(lastVisible);
  }
  async function getTagArticlesFromFirebase(tag: string): Promise<void> {
    const articlesCollectionRef = collection(db, "articles");

    // check numbers of articles
    const q = query(articlesCollectionRef, where("tag", "==", tag));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 9) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 9));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    const first = query(
      articlesCollectionRef,
      where("tag", "==", tag),
      orderBy("created_at"),
      limit(9),
    );
    const documentSnapshots = await getDocs(first);
    const articlesArray = documentSnapshots.docs.map((doc) => doc.data());
    setArticlesList(articlesArray);

    const firstVisible = documentSnapshots.docs[0];
    setFirstDocument(firstVisible);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocument(lastVisible);
  }
  async function getSurfingSpotArticlesFromFirebase(
    surfingSpot: string,
  ): Promise<void> {
    const articlesCollectionRef = collection(db, "articles");

    // check numbers of articles
    const q = query(
      articlesCollectionRef,
      where("surfingSpot", "==", surfingSpot),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 9) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 9));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    const first = query(
      articlesCollectionRef,
      where("surfingSpot", "==", surfingSpot),
      orderBy("created_at"),
      limit(9),
    );
    const documentSnapshots = await getDocs(first);
    const articlesArray = documentSnapshots.docs.map((doc) => doc.data());
    setArticlesList(articlesArray);

    const firstVisible = documentSnapshots.docs[0];
    setFirstDocument(firstVisible);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocument(lastVisible);
  }
  async function getTagAndSurfingSpotArticlesFromFirebase(
    tag: string,
    surfingSpot: string,
  ): Promise<void> {
    const articlesCollectionRef = collection(db, "articles");

    // check numbers of articles
    const q = query(
      articlesCollectionRef,
      where("tag", "==", tag),
      where("surfingSpot", "==", surfingSpot),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 9) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 9));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    const first = query(
      articlesCollectionRef,
      where("tag", "==", tag),
      where("surfingSpot", "==", surfingSpot),
      orderBy("created_at"),
      limit(9),
    );
    const documentSnapshots = await getDocs(first);
    const articlesArray = documentSnapshots.docs.map((doc) => doc.data());
    setArticlesList(articlesArray);

    const firstVisible = documentSnapshots.docs[0];
    setFirstDocument(firstVisible);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocument(lastVisible);
  }

  useEffect(() => {
    const fetchDataFromFirebase = async (): Promise<void> => {
      setIsArticleLoading(true);

      try {
        await getArticlesFromFirebase();
      } catch (error) {
        console.log(error);
      }

      setIsArticleLoading(false);
    };

    fetchDataFromFirebase();
  }, []);

  const pages = Array.from({ length: allPage }, (_, index) => {
    return index + 1;
  });

  return (
    <>
      <section>
        <div className="flex justify-between border-b border-gray-300 pb-4">
          <h2 className="text-2xl font-bold">所有文章</h2>

          <div className="flex gap-1">
            <button
              type="button"
              className={`btn btn-sm btn-circle hover:border-none ${layout === "grid" && "bg-purple-light hover:bg-purple-light"}`}
              onClick={() => setLayout("grid")}
            >
              <BsFillGridFill />
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-circle hover:border-none ${layout === "list" && "bg-purple-light hover:bg-purple-light"}`}
              onClick={() => setLayout("list")}
            >
              <BsList />
            </button>
          </div>
        </div>

        <form
          method="get"
          onSubmit={formHandler}
          className="mt-8 grid w-full grid-cols-2 items-end gap-4 rounded-md bg-purple-light px-8 pb-7 pt-4"
        >
          {/* select tag */}
          <div className="form-control">
            <label className="label" htmlFor="tag">
              <span className="label-text">選擇標籤</span>
            </label>
            <select
              id="tag"
              name="tag"
              value={tag}
              className="select select-sm focus:outline-none"
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="travel">旅遊雜記</option>
              <option value="knowledge">知識技巧</option>
              <option value="life">生活分享</option>
              <option value="gear">裝備介紹</option>
              <option value="activity">活動競賽</option>
              <option value="secondhand">二手拍賣</option>
            </select>
          </div>

          {/* select spot */}
          <div className="form-control">
            <label className="label" htmlFor="surfingSpot">
              <span className="label-text">選擇地點</span>
            </label>
            <select
              id="surfingSpot"
              name="surfingSpot"
              value={surfingSpot}
              className="select select-sm focus:outline-none"
              onChange={(e) => setSurfingSpot(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="jialeshuei">佳樂水</option>
              <option value="nanwan">南灣</option>
              <option value="qijin">旗津</option>
              <option value="chunan">竹南</option>
              <option value="baishawan">白沙灣</option>
              <option value="jinshan">金山</option>
              <option value="green-bay">翡翠灣</option>
              <option value="fulong">福隆</option>
              <option value="dashi">大溪</option>
              <option value="double-lions">雙獅</option>
              <option value="wushi">烏石港</option>
              <option value="choushui">臭水</option>
              <option value="gongs">鹽寮漁港</option>
              <option value="jiqi">磯崎</option>
              <option value="bashiendong">八仙洞</option>
              <option value="chenggong">成功</option>
              <option value="donghe">東河</option>
              <option value="jinzun">金樽</option>
              <option value="others">其他</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <button
              type="submit"
              className="btn btn-sm bg-pink-light hover:bg-pink-dark w-full border-transparent hover:border-transparent"
            >
              Search
            </button>
            <button
              type="button"
              className="btn btn-sm border-transparent bg-blue-light hover:border-transparent hover:bg-blue-dark"
              onClick={resetHandler}
            >
              Reset
            </button>
          </div>
        </form>

        {(isArticleLoading || !articlesList) && (
          <p className="mt-8">loading now...</p>
        )}
        {!isArticleLoading && articlesList && articlesList.length < 1 && (
          <h3 className="mt-8">目前尚未有相關的文章... 請重新查詢</h3>
        )}

        {/* grid layout */}
        {layout === "grid" && (
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
                      <h3 className="text-xl font-semibold capitalize">
                        {title}
                      </h3>

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
        )}

        {/* list layout */}
        {layout === "list" && (
          <div className="mt-8 flex flex-col gap-y-8">
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
                    className="card group flex-row items-center px-10 py-6 shadow-xl transition-all duration-300 hover:cursor-pointer hover:shadow-2xl"
                    onClick={() => articleHandler(id)}
                  >
                    <img
                      src={cover}
                      alt={surfingSpot}
                      className="h-[120px] w-[120px] rounded-2xl object-cover object-center duration-500 group-hover:scale-105"
                    />

                    <div className="ml-6">
                      <h3 className="text-xl font-semibold">{title}</h3>

                      <p className="mt-3 line-clamp-1 text-base text-gray-600">
                        {htmlToPlainText(content)}
                      </p>

                      <div className="mt-5 flex items-center">
                        <div className="flex w-[120px] gap-1">
                          <span className="rounded-lg bg-green-bright px-1 text-xs text-white">
                            {changeTagName(tag)}
                          </span>

                          <span className="rounded-lg bg-orange-bright px-1 text-xs text-white">
                            {changeSpotName(surfingSpot)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center">
                        <p className="text-xs text-gray-500">
                          {formatTime(created_at)}
                        </p>
                        <div className="ml-16 flex items-center gap-1">
                          <FaStar className=" text-yellow" />
                          <span>{likes_amount}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        )}

        {/* pagination */}
        {showPagination && (
          <div className="mt-16 flex justify-center">
            <div className="join">
              {/* prev button */}
              <button
                className="btn btn-sm sm:btn-md join-item"
                disabled={nowPage === 1}
                onClick={prevHandler}
              >
                prev
              </button>

              {/* dynamic generation */}
              {pages.map((pageNumber) => {
                return (
                  <div
                    key={pageNumber}
                    className={`join-item flex h-8 w-8 items-center justify-center bg-gray-100 px-3 text-xs font-bold sm:h-12 sm:w-12 sm:px-4 sm:text-sm ${
                      pageNumber === nowPage && "bg-gray-500"
                    }`}
                  >
                    {pageNumber}
                  </div>
                );
              })}

              {/* next button */}
              <button
                className="btn btn-sm sm:btn-md join-item"
                disabled={nowPage === allPage}
                onClick={nextHandler}
              >
                next
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AllArticlesContainer;
