import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleCommentsContainer, Loading } from "../components";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setAuthor } from "../features/article/articleSlice";
import { IRootState } from "../store";
import { formatTime } from "../utils";

// react-icons
import { TbMessageCircle } from "react-icons/tb";

// ReactQuill
import "react-quill/dist/quill.snow.css";

// interwave
// covert HTML sting to JSX, safely render HTML to prevent xss attack
import { Markup } from "interweave";

// firebase
import { db } from "../main";
import {
  doc,
  getDoc,
  getDocs,
  DocumentData,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// framer motion
import { motion, Variants } from "framer-motion";
const centerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

// shadcn
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const Article: React.FC = () => {
  const { id } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);
  const { author } = useSelector((state: IRootState) => state.article);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [article, setArticle] = useState<DocumentData | undefined>(undefined);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [commentLength, setCommentLength] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const editHandler = (id: string) => {
    navigate(`/profile/edit-article/${id}`);
  };

  const deleteButtonHandler = () => {
    setShowModal(true);
  };
  const softDeleteHandler = async (id: string): Promise<void> => {
    const articleRef = doc(db, "articles", id);
    const docSnap = await getDoc(articleRef);
    if (docSnap.exists()) {
      await updateDoc(articleRef, {
        isDeleted: true,
      });
      toast.info("Deleted Successfully 😢");
      setTimeout(() => {
        navigate("/profile/my-articles");
      }, 800);
    }
  };

  const removeUserLikesFromFirebase = async (id: string): Promise<void> => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { articlesCollection } = docSnap.data();
      const newArticlesCollection = [...articlesCollection].filter(
        (item) => item !== id,
      );
      await updateDoc(userRef, {
        articlesCollection: newArticlesCollection,
      });
    }
  };
  const removeArticleLikesFromFirebase = async (id: string): Promise<void> => {
    if (!user) return;
    const articleRef = doc(db, "articles", id);
    const docSnap = await getDoc(articleRef);
    if (docSnap.exists()) {
      const { likes_amount } = docSnap.data();
      const newLikes_amount = likes_amount - 1;
      await updateDoc(articleRef, {
        likes_amount: newLikes_amount,
      });
    }
  };
  const addUserLikesToFirebase = async (id: string): Promise<void> => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { articlesCollection } = docSnap.data();
      const newArticlesCollection = [...articlesCollection, id];
      await updateDoc(userRef, {
        articlesCollection: newArticlesCollection,
      });
    }
  };
  const addArticleLikesToFirebase = async (id: string): Promise<void> => {
    if (!user) return;
    const articleRef = doc(db, "articles", id);
    const docSnap = await getDoc(articleRef);
    if (docSnap.exists()) {
      const { likes_amount } = docSnap.data();
      const newLikes_amount = likes_amount + 1;
      await updateDoc(articleRef, {
        likes_amount: newLikes_amount,
      });
    }
  };
  const collectionHandler = async (id: string): Promise<void> => {
    // turn like into disLike
    if (isLike) {
      await removeUserLikesFromFirebase(id);
      await removeArticleLikesFromFirebase(id);
      setIsLike(false);
      toast.info("Removed from favorites 👻");
      return;
    }

    // turn dislike into like
    if (!isLike) {
      await addUserLikesToFirebase(id);
      await addArticleLikesToFirebase(id);
      setIsLike(true);
      toast.info("Added to favorites ❤️");
      return;
    }
  };

  const fetchArticleFromFirebase = async (): Promise<
    DocumentData | undefined
  > => {
    if (!id) return;
    try {
      const docRef = doc(db, "articles", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle(docSnap.data());
        return docSnap.data();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAuthorFromFirebase = async (data: DocumentData): Promise<void> => {
    try {
      const docRef = doc(db, "users", data.authorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        dispatch(setAuthor(docSnap.data()));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUserFromFirebase = async (
    userId: string,
  ): Promise<DocumentData | undefined> => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkStatus = async (
    articleData: DocumentData,
    userData: DocumentData,
  ): Promise<void> => {
    if (articleData.authorId === userData.id) {
      setIsLogin(true);
      setIsUser(true);
      return;
    }
    if (
      articleData.authorId !== userData.id &&
      userData.articlesCollection.includes(articleData.id)
    ) {
      setIsLogin(true);
      setIsLike(true);
      return;
    }
    if (
      articleData.authorId !== userData.id &&
      !userData.articlesCollection.includes(articleData.id)
    ) {
      setIsLogin(true);
      return;
    }
  };

  async function getCommentsFromFirebase(articleId: string): Promise<void> {
    const commentsCollectionRef = collection(
      db,
      "articles",
      articleId,
      "comments",
    );

    // order and limit
    const q = query(commentsCollectionRef, orderBy("created_at", "desc"));

    const querySnapshot = await getDocs(q);
    const commentArray = querySnapshot.docs.map((doc) => doc.data());

    setCommentLength(commentArray.length);
  }

  useEffect(() => {
    setIsLoading(true);

    const executeFunction = async () => {
      try {
        const articleData = await fetchArticleFromFirebase();
        if (!articleData) return;
        await fetchAuthorFromFirebase(articleData);
        if (!user) return;
        const userData = await fetchUserFromFirebase(user.id);
        if (!userData) return;
        await checkStatus(articleData, userData);
      } catch (error) {
        console.log(error);
      }
    };

    setIsLoading(false);

    executeFunction();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);

      const unsubscribe = onSnapshot(
        collection(db, "articles", id, "comments"),
        async (snapshot) => {
          // console.log(snapshot.docChanges());

          if (snapshot.docChanges().length > 0) {
            const { type } = snapshot.docChanges()[0];
            if (type === "added" || type === "modified" || type === "removed") {
              //   console.log("execute");
              await getCommentsFromFirebase(id);
            }
          }

          setIsLoading(false);
        },
      );

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (showModal) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    // Ensure scrolling is re-enabled when component unmounts
    return () => {
      body.style.overflow = "auto";
    };
  }, [showModal]);

  if (isLoading || !article || !author) {
    return <Loading />;
  }

  const {
    id: articleId,
    content,
    cover,
    updated_at,
    title,
    photographerLink,
    photographerName,
  } = article;
  const { name: authorName, profile_picture: authorImage } = author;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <Sheet>
        {/* cover */}
        <div className="relative h-[450px] w-full">
          <img
            src={cover}
            alt="cover-image"
            className="h-full w-full object-cover object-center"
          />
          <p className="absolute -bottom-[22px] right-[20px] font-sriracha text-[12px] font-medium text-gray-500">
            Photo by&nbsp;
            <a
              href={photographerLink}
              target="_blank"
              rel="noreferrer noopener"
              className="capitalize duration-150 hover:text-blue-dark hover:underline hover:underline-offset-4"
            >
              {photographerName}
            </a>
            &nbsp;on&nbsp;
            <a
              href="https://unsplash.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-blue-dark hover:underline hover:underline-offset-4"
            >
              Unsplash
            </a>
          </p>
        </div>

        {/* context */}
        <div className="align-container py-24">
          {/* title */}
          <div className="px-[15px] text-4xl font-bold capitalize">{title}</div>

          {/* authorInfo */}
          <div className="mt-6 px-[15px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                {/* userName & userImage */}
                <div className="flex items-center gap-2">
                  <img
                    src={authorImage}
                    alt="author-image"
                    className="h-10 w-10 rounded-full border-2 border-turquoise"
                  />
                  <p className="text-2xl">
                    <span className="ml-2 font-fashioncountry text-turquoise">
                      {authorName}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    更新時間:
                    <span className="ml-2">{formatTime(updated_at)}</span>
                  </p>

                  {/* comment button */}
                  <SheetTrigger className="flex items-center gap-2">
                    <TbMessageCircle className="h-5 w-5 text-pink-dark group-hover:text-pink" />
                    <span className="mb-[1px] text-[16px] text-pink-dark  group-hover:text-pink">
                      {commentLength}
                    </span>
                  </SheetTrigger>
                </div>
              </div>

              {/* edit/collection  button */}
              {isLogin && isUser && (
                <div className="mt-2 flex gap-4">
                  <Button
                    type="button"
                    variant={"olive-hipster"}
                    onClick={() => editHandler(articleId)}
                  >
                    編輯文章
                  </Button>
                  <Button
                    type="button"
                    variant={"clay-red-hipster"}
                    onClick={() => deleteButtonHandler()}
                  >
                    刪除文章
                  </Button>
                </div>
              )}
              {isLogin && !isUser && id && (
                <Button
                  type="button"
                  variant={"purple-hipster"}
                  onClick={() => collectionHandler(id)}
                >
                  {isLike ? "已收藏" : "加入收藏"}
                </Button>
              )}
            </div>
          </div>

          {/* content */}
          <div className="mt-10">
            <div className="ql-snow">
              <div className="ql-editor" data-gramm="false">
                <Markup content={content} />
              </div>
            </div>
          </div>
        </div>

        <ArticleCommentsContainer />
      </Sheet>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex h-full w-full items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={centerVariant}
            viewport={{ once: true }}
            className="flex w-[420px] flex-col rounded-xl bg-white p-5"
            style={{ boxShadow: "rgba(6, 2, 2, 0.15) 0px 2px 10px" }}
          >
            <div className="flex flex-col text-center font-helvetica">
              <h3 className="text-xl font-bold">Delete Article</h3>
              <p className="mx-auto mt-3 w-[80%] text-sm text-gray-500">
                Deletion is not reversible, and the article will be completely
                removed from public view.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                Still want to proceed?
              </p>
            </div>

            <div className="mx-auto mt-4 flex gap-4">
              <Button
                type="button"
                variant={"turquoise-hipster"}
                size={"sm"}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={"pink-hipster"}
                size={"sm"}
                onClick={() => softDeleteHandler(articleId)}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.main>
  );
};

export default Article;
