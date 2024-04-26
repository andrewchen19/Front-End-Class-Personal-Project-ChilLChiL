import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { closeComment } from "../features/article/articleSlice";
import { IRootState } from "../store";
import { formatMessageTime } from "../utils";
import { CommentInfo } from "../types";

// nano id
import { nanoid } from "nanoid";

// react icons
import { IoCloseSharp } from "react-icons/io5";

// firebase
import { db } from "../main";
import {
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  setDoc,
  DocumentData,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// interwave
// covert HTML sting to JSX, safely render HTML to prevent xss attack
import { Markup } from "interweave";

const ArticleCommentsContainer: React.FC = () => {
  const { id } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);
  const { isCommentOpen } = useSelector((state: IRootState) => state.article);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [commentLength, setCommentLength] = useState<number>(0);
  const [commentList, setCommentList] = useState<DocumentData | []>([]);
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<DocumentData | null>(null);

  const deleteCommentHandler = async (commentId: string): Promise<void> => {
    if (!id) return;
    try {
      const spotRef = doc(db, "articles", id);
      const subCollectionRef = collection(spotRef, "comments");
      await deleteDoc(doc(subCollectionRef, commentId));
      setComment("");
      setIsEditStatus(false);
      toast.success("Delete comment successful 🎉");
    } catch (error) {
      console.log(error);
    }
  };
  const getCommentHandler = async (commentId: string): Promise<void> => {
    if (!id) return;
    try {
      const commentRef = doc(db, "articles", id, "comments", commentId);

      const docSnap = await getDoc(commentRef);

      if (docSnap.exists()) {
        setIsEditStatus(true);
        setEditInfo(docSnap.data());
        setComment(docSnap.data().comment);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const commentHandler = async (): Promise<void> => {
    if (!id) return;
    if (!user) {
      toast.warning("Please Log In First 😵");
      return;
    }
    if (!comment || comment === "<p><br></p>") {
      toast.warning("Comment can't be empty 😬");
      return;
    }
    if (isEditStatus) {
      setEditedCommentToFirebase();
    } else {
      addNewCommentToFirebase();
    }
  };
  const cancelEditHandler = (): void => {
    setComment("");
    setEditInfo(null);
    setIsEditStatus(false);
  };

  async function getUserInfoFromFirebase(
    commentArray: DocumentData[],
  ): Promise<void> {
    let newArray = [];

    for (const comment of commentArray) {
      const docRef = doc(db, "users", comment.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userName = docSnap.data().name;
        const userImage = docSnap.data().profile_picture;
        const newComment = { ...comment, userName, userImage };
        newArray.push(newComment);
      }
    }

    setCommentList(newArray);
    setCommentLength(newArray.length);
  }
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
    await getUserInfoFromFirebase(commentArray);
  }
  async function addNewCommentToFirebase(): Promise<void> {
    if (!id) return;
    if (!user) return;

    const commentId = nanoid();

    const commentObj = {
      id: commentId,
      userId: user.id,
      comment,
      created_at: Date.now(),
      updated_at: Date.now(),
      isEdited: false,
    };

    try {
      const articleRef = doc(db, "articles", id);
      const subCollectionRef = collection(articleRef, "comments");
      await setDoc(doc(subCollectionRef, commentId), commentObj);
      toast.success("Add comment successful 🎉");
      setComment("");
    } catch (error) {
      console.log(error);
    }
  }
  async function setEditedCommentToFirebase(): Promise<void> {
    if (!id) return;
    if (!user) return;
    if (!editInfo) return;

    const commentObj = {
      ...editInfo,
      comment,
      updated_at: Date.now(),
      isEdited: true,
    };

    try {
      const articleRef = doc(db, "articles", id);
      const subCollectionRef = collection(articleRef, "comments");
      await setDoc(doc(subCollectionRef, editInfo.id), commentObj);
      toast.success("Edit comment successful 🎉");
      setComment("");
      setIsEditStatus(false);
      setEditInfo(null);
    } catch (error) {
      console.log(error);
    }
  }

  const modules = {
    toolbar: [["bold", "italic", "underline", "strike"]],
  };

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

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-20 h-full w-full hover:cursor-pointer"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        onClick={() => dispatch(closeComment())}
      ></div>

      <div
        className={`fixed right-0 top-0 z-30 h-full w-[350px] transform bg-white shadow-xl transition-transform duration-300 ${
          isCommentOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* title */}
        <div className="flex items-center justify-between border-b border-gray-300 px-8 py-5">
          <h3 className="text-xl font-bold text-black">
            Response&nbsp;(<span>{commentLength}</span>)
          </h3>

          <button className="mt-2" onClick={() => dispatch(closeComment())}>
            <IoCloseSharp className="text-lg text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* comments */}
        <div className="mt-5 px-5">
          {/* text editor */}
          <ReactQuill
            theme="snow"
            value={comment}
            modules={modules}
            onChange={setComment}
            placeholder="請輸入留言 ..."
          />

          {/* button */}
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="btn-purple sm:btn-xs"
              onClick={() => commentHandler()}
            >
              {isEditStatus ? "更新留言" : "新增留言"}
            </button>

            {isEditStatus && (
              <button
                type="button"
                className="btn-purple sm:btn-xs"
                onClick={() => cancelEditHandler()}
              >
                取消
              </button>
            )}
          </div>

          {isLoading && <div className="mt-5">is loading...</div>}

          {/* real time comments */}
          {!isLoading && (
            <div className="mt-6">
              {commentList.length < 1 && <p>目前尚未有留言.....</p>}

              {/* latest 10 comments */}
              {commentList.length > 0 && (
                <div className="my-auto flex h-[443.16px] flex-col gap-3 overflow-auto">
                  {commentList.map((item: CommentInfo) => {
                    const {
                      id: commentId,
                      userId,
                      userName,
                      userImage,
                      comment,
                      created_at,
                      isEdited,
                    } = item;
                    return (
                      <div key={id} className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <img
                            src={userImage}
                            alt="user-image"
                            className="h-5 w-5 rounded-full"
                          />
                          <h4 className="ml-1 w-[72px]">{userName}</h4>

                          <p className="w-[125px] text-xs">
                            {formatMessageTime(created_at)}&nbsp;
                            {isEdited && <span>(edited)</span>}
                          </p>

                          {user && userId === user.id && (
                            <>
                              <span
                                className="cursor-pointer text-xs text-gray-500 underline hover:text-gray-600"
                                onClick={() => getCommentHandler(commentId)}
                              >
                                Edit
                              </span>
                              <span
                                className="ml-2 cursor-pointer text-xs text-gray-500 underline hover:text-gray-600"
                                onClick={() => deleteCommentHandler(commentId)}
                              >
                                Delete
                              </span>
                            </>
                          )}
                        </div>

                        <div className="rounded-lg bg-black text-sm text-turquoise">
                          <div className="ql-snow">
                            <div className="ql-editor py-2" data-gramm="false">
                              <Markup content={comment} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticleCommentsContainer;
