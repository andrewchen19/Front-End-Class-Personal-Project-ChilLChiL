import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatTime,
  changeSpotName,
  changeTagName,
  htmlToPlainText,
} from "../utils";
import books from "../assets/icons/books.svg";

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
  Query,
} from "firebase/firestore";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [order, setOrder] = useState<string>("desc");

  const articleHandler = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const prevHandler = async () => {
    const articlesCollectionRef = collection(db, "articles");

    // get the prev 12 documents
    let prev: Query<DocumentData, DocumentData>;
    if (order === "asc") {
      prev = query(
        articlesCollectionRef,
        where("isDeleted", "!=", true),
        orderBy("created_at"),
        endBefore(firstDocument),
        limitToLast(12),
      );
    } else {
      prev = query(
        articlesCollectionRef,
        where("isDeleted", "!=", true),
        orderBy("created_at", "desc"),
        endBefore(firstDocument),
        limitToLast(12),
      );
    }

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

    // get the next 12 documents
    let next: Query<DocumentData, DocumentData>;
    if (order === "asc") {
      next = query(
        articlesCollectionRef,
        where("isDeleted", "!=", true),
        orderBy("created_at"),
        startAfter(lastDocument),
        limit(12),
      );
    } else {
      next = query(
        articlesCollectionRef,
        where("isDeleted", "!=", true),
        orderBy("created_at", "desc"),
        startAfter(lastDocument),
        limit(12),
      );
    }

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

    setNowPage(1);
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
    const q = query(articlesCollectionRef, where("isDeleted", "!=", true));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 12) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 12));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    let first: Query<DocumentData, DocumentData>;
    if (order === "asc") {
      first = query(
        articlesCollectionRef,
        where("isDeleted", "!=", true),
        orderBy("created_at"),
        limit(12),
      );
    } else {
      first = query(
        articlesCollectionRef,
        where("isDeleted", "!=", true),
        orderBy("created_at", "desc"),
        limit(12),
      );
    }
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
    const q = query(
      articlesCollectionRef,
      where("tag", "==", tag),
      where("isDeleted", "!=", true),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 12) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 12));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    let first: Query<DocumentData, DocumentData>;
    if (order === "asc") {
      first = query(
        articlesCollectionRef,
        where("tag", "==", tag),
        where("isDeleted", "!=", true),
        orderBy("created_at"),
        limit(12),
      );
    } else {
      first = query(
        articlesCollectionRef,
        where("tag", "==", tag),
        where("isDeleted", "!=", true),
        orderBy("created_at", "desc"),
        limit(12),
      );
    }
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
      where("isDeleted", "!=", true),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 12) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 12));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    let first: Query<DocumentData, DocumentData>;
    if (order === "asc") {
      first = query(
        articlesCollectionRef,
        where("surfingSpot", "==", surfingSpot),
        where("isDeleted", "!=", true),
        orderBy("created_at"),
        limit(12),
      );
    } else {
      first = query(
        articlesCollectionRef,
        where("surfingSpot", "==", surfingSpot),
        where("isDeleted", "!=", true),
        orderBy("created_at", "desc"),
        limit(12),
      );
    }
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
      where("isDeleted", "!=", true),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 12) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 12));
    } else {
      setShowPagination(false);
      setAllPage(1);
    }

    // Query the first page of docs
    let first: Query<DocumentData, DocumentData>;
    if (order === "asc") {
      first = query(
        articlesCollectionRef,
        where("tag", "==", tag),
        where("surfingSpot", "==", surfingSpot),
        where("isDeleted", "!=", true),
        orderBy("created_at"),
        limit(12),
      );
    } else {
      first = query(
        articlesCollectionRef,
        where("tag", "==", tag),
        where("surfingSpot", "==", surfingSpot),
        where("isDeleted", "!=", true),
        orderBy("created_at", "desc"),
        limit(12),
      );
    }
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

  return (
    <section>
      {/* title */}
      <div className="mb-10 flex justify-between border-b border-gray-300 pb-4">
        <div className="flex items-center gap-3">
          <img src={books} alt="image" className="mt-1 h-9 w-9" />
          <h2 className="text-2xl font-bold">所有文章</h2>
        </div>

        <div className="flex gap-1">
          <Button
            type="button"
            variant={`${layout === "grid" ? "olive" : "ghost"}`}
            size={"real-full"}
            onClick={() => setLayout("grid")}
          >
            <BsFillGridFill />
          </Button>
          <Button
            type="button"
            variant={`${layout === "list" ? "olive" : "ghost"}`}
            size={"real-full"}
            onClick={() => setLayout("list")}
          >
            <BsList />
          </Button>
        </div>
      </div>

      <form
        method="get"
        onSubmit={formHandler}
        className="mb-10 grid w-full grid-cols-2 items-end gap-4 rounded-md bg-purple-light px-8 pb-7 pt-4"
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
            className="select select-sm bg-white focus:outline-none"
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
            className="select select-sm bg-white focus:outline-none"
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

        {/* select time */}
        <div className="form-control">
          <label className="label" htmlFor="order">
            <span className="label-text">時間排序</span>
          </label>
          <select
            id="order"
            name="order"
            value={order}
            className="select select-sm bg-white focus:outline-none"
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">由新到舊</option>
            <option value="asc">由舊到新</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Button type="submit" variant={"pink"}>
            Search
          </Button>
          <Button type="button" variant={"blue"} onClick={resetHandler}>
            Reset
          </Button>
        </div>
      </form>

      {(isArticleLoading || !articlesList) && layout === "grid" && (
        <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="skeleton h-[360px] rounded-lg"></div>
        </div>
      )}
      {(isArticleLoading || !articlesList) && layout === "list" && (
        <div className="grid w-full">
          <div className="skeleton h-[190px] rounded-lg"></div>
        </div>
      )}

      {!isArticleLoading && articlesList && articlesList.length < 1 && (
        <h3>尚未有相關的文章... 請重新查詢</h3>
      )}

      {/* grid layout */}
      {!isArticleLoading && layout === "grid" && (
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
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
                  className="relative flex flex-grow rounded-none border-none"
                >
                  <CardContent className="flex h-full w-full flex-col">
                    <div
                      className="relative hover:cursor-pointer"
                      onClick={() => articleHandler(id)}
                    >
                      <img
                        src={cover}
                        alt={surfingSpot}
                        className="h-[230px] w-full rounded-lg object-cover object-center "
                      />

                      <div className="absolute inset-0 flex items-center justify-center px-10">
                        <div
                          className="mx-auto "
                          style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                        >
                          <div className="p-2 text-center shadow-lg">
                            <h3 className="text-xl font-semibold capitalize">
                              {title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-grow flex-col pt-3">
                      <div className="mb-3 flex flex-col gap-2">
                        <p className="line-clamp-3 text-base text-gray-600">
                          {htmlToPlainText(content)}
                        </p>
                        <div>
                          <span
                            className="relative border-b-clay-red text-clay-red hover:cursor-pointer hover:border-b"
                            onClick={() => articleHandler(id)}
                          >
                            Continue Reading
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex gap-2">
                          <span className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-semibold tracking-wide text-gray-700">
                            {changeTagName(tag)}
                          </span>

                          <span className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-semibold tracking-wide text-gray-700">
                            {changeSpotName(surfingSpot)}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-gray-700">
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

      {/* list layout */}
      {!isArticleLoading && layout === "list" && (
        <div className="flex flex-col gap-y-8">
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
                  className="group flex flex-row items-center bg-gray-50 px-10 py-6 duration-300 hover:cursor-pointer hover:shadow-lg"
                  onClick={() => articleHandler(id)}
                >
                  <img
                    src={cover}
                    alt={surfingSpot}
                    className="h-[140px] w-[140px] rounded-2xl object-cover object-center duration-500 group-hover:scale-105"
                  />

                  <div className="ml-6">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold">{title}</h3>
                      <div className="ml-16 flex items-center gap-1">
                        <FaStar className=" text-yellow" />
                        <span>{likes_amount}</span>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-1 text-base text-gray-600">
                      {htmlToPlainText(content)}
                    </p>

                    <div className="mt-5 flex items-center">
                      <div className="flex gap-2">
                        <span className="rounded-lg  bg-green px-[6px] py-1 text-xs tracking-wide text-white">
                          {changeTagName(tag)}
                        </span>

                        <span className="rounded-lg bg-orange px-[6px] py-1 text-xs tracking-wide text-white">
                          {changeSpotName(surfingSpot)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center">
                      <p className="text-xs text-gray-500">
                        {formatTime(created_at)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* pagination */}
      {showPagination && (
        <div className="mt-16 flex justify-center">
          <div className="flex">
            {/* prev button */}
            <Button
              type="button"
              variant={"pink"}
              size={"prev"}
              disabled={nowPage === 1}
              onClick={prevHandler}
            >
              prev
            </Button>

            <div className="flex h-12 w-[136px] items-center justify-center bg-pink-light px-3 font-semibold">
              Page {nowPage} / {allPage}
            </div>

            {/* next button */}
            <Button
              type="button"
              variant={"pink"}
              size={"next"}
              disabled={nowPage === allPage}
              onClick={nextHandler}
            >
              next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AllArticlesContainer;
