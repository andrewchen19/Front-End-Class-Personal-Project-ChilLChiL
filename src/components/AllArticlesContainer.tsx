import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatTime, changeSpotName, changeTagName } from "../utils";

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
} from "firebase/firestore";

const AllArticlesContainer: React.FC = () => {
  const navigate = useNavigate();

  const [isArticleLoading, setIsArticleLoading] = useState<boolean>(false);
  const [articlesList, setArticlesList] = useState<DocumentData[] | []>([]);

  const [showPagination, setShowPagination] = useState<boolean>(false);
  const [allPage, setAllPage] = useState<number>(1);
  const [nowPage, setNowPage] = useState<number>(1);
  const [firstDocument, setFirstDocument] = useState<DocumentData | null>(null);
  const [lastDocument, setLastDocument] = useState<DocumentData | null>(null);

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
      limitToLast(10),
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
      limit(10),
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

  async function getArticlesFromFirebase(): Promise<void> {
    const articlesCollectionRef = collection(db, "articles");

    // check numbers of articles
    const q = query(articlesCollectionRef, orderBy("created_at"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 10) {
      setShowPagination(true);
      setAllPage(Math.ceil(querySnapshot.size / 10));
    }

    // Query the first page of docs
    const first = query(
      articlesCollectionRef,
      orderBy("created_at"),
      limit(10),
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
    <section>
      <h2 className="text-2xl font-bold">所有文章</h2>

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
                <button
                  type="button"
                  key={pageNumber}
                  className={`btn btn-sm sm:btn-md join-item bg-gray-100 ${
                    pageNumber === nowPage && "bg-gray-500"
                  }`}
                >
                  {pageNumber}
                </button>
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
  );
};

export default AllArticlesContainer;
