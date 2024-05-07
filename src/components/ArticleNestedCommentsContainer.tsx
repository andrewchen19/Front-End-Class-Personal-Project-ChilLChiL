import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { calculateTimeAgo } from "../utils";
import { CommentInfo } from "../types";

// nano id
import { nanoid } from "nanoid";

// react icons
import { RiHeartLine, RiHeartFill } from "react-icons/ri";

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
  updateDoc,
} from "firebase/firestore";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// interwave
// covert HTML sting to JSX, safely render HTML to prevent xss attack
import { Markup } from "interweave";

// framer motion
import { motion, Variants } from "framer-motion";
const topVariant: Variants = {
  hidden: { y: "-30px" },
  visible: { y: 0, transition: { duration: 1.2 } },
};

// shadcn
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  commentId: string;
}

const ArticleNestedCommentsContainer: React.FC<Props> = ({ commentId }) => {
  const { id } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);
  const { author } = useSelector((state: IRootState) => state.article);

  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [nestCommentList, setNestCommentList] = useState<CommentInfo[] | []>(
    [],
  );
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<DocumentData | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [shouldDeleteId, setShouldDeleteId] = useState<string>("");

  // !!
  const deleteButtonHandler = (commentId: string) => {
    setShowAlert(true);
    setShouldDeleteId(commentId);
  };
  const deleteCommentHandler = async (): Promise<void> => {
    if (!id) return;
    if (!shouldDeleteId) return;
    try {
      const spotRef = doc(db, "articles", id);
      const subCollectionRef = collection(spotRef, "comments");
      await deleteDoc(doc(subCollectionRef, shouldDeleteId));
      setComment("");
      setIsEditStatus(false);
      setShouldDeleteId("");
      setShowAlert(false);
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
      setEditedNestCommentToFirebase();
    } else {
      addNewNestCommentToFirebase();
    }
  };
  const cancelEditHandler = (): void => {
    setComment("");
    setEditInfo(null);
    setIsEditStatus(false);
  };
  const likeHandler = async (commentId: string): Promise<void> => {
    if (!id) return;
    if (!user) {
      toast.warning("Please Log In First 😵");
      return;
    }

    try {
      const articleRef = doc(db, "articles", id);
      const subCollectionRef = collection(articleRef, "comments");
      const commentRef = doc(subCollectionRef, commentId);
      const data = (await getDoc(commentRef))?.data();
      if (!data) return;
      const newLikes = [...data.likes, user.id];
      // console.log(data);
      const updatedData = { ...data, likes: newLikes };
      await setDoc(commentRef, updatedData);
      toast.success("Like comment successfully 🎉");
    } catch (error) {
      console.log(error);
    }
  };

  // !!
  async function getUserInfoFromFirebase(
    commentArray: CommentInfo[],
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
    setNestCommentList(newArray);
  }
  async function getNestCommentsFromFirebase(articleId: string): Promise<void> {
    const commentsCollectionRef = collection(
      db,
      "articles",
      articleId,
      "comments",
    );
    const commentRef = doc(commentsCollectionRef, commentId);
    const docSnap = await getDoc(commentRef);
    if (!docSnap.exists()) return;
    // console.log(docSnap.data());
    if (docSnap.data().replies.length > 0) {
      const nestCommentArray: CommentInfo[] = docSnap.data().replies;
      await getUserInfoFromFirebase(nestCommentArray);
    } else {
      setNestCommentList([]);
    }

    // const q = query(commentsCollectionRef, orderBy("created_at", "desc"));
    // const querySnapshot = await getDocs(q);
    // const commentArray = querySnapshot.docs.map((doc) => doc.data());
  }
  async function addNewNestCommentToFirebase(): Promise<void> {
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
      likes: [],
    };

    // console.log(id, commentId);

    // const commentsCollectionRef = collection(db, "articles", id, "comments");
    // const commentRef = doc(commentsCollectionRef, commentId);
    // const docSnap = await getDoc(commentRef);
    // console.log(docSnap.exists());
    // if (!docSnap.exists()) return;
    // console.log(docSnap.data());

    try {
      const commentRef = doc(db, "articles", id, "comments", commentId);
      const docSnap = await getDoc(commentRef);
      console.log(docSnap.exists());
      if (!docSnap.exists()) return;
      //   console.log(docSnap.data());
      await updateDoc(commentRef, {
        replies: [...docSnap.data().replies, commentObj],
      });
      toast.success("Add nest comment successfully 🎉");
      setComment("");
    } catch (error) {
      console.log(error);
    }
  }
  async function setEditedNestCommentToFirebase(): Promise<void> {
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
    toolbar: [[{ header: [false] }], ["bold", "italic", "underline", "strike"]],
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);

      // console.log("execute");

      const unsubscribe = onSnapshot(
        collection(db, "articles", id, "comments"),
        async (snapshot) => {
          // console.log(snapshot.docChanges());

          if (snapshot.docChanges().length > 0) {
            const { type } = snapshot.docChanges()[0];
            if (type === "added" || type === "modified" || type === "removed") {
              //   console.log("execute");
              await getNestCommentsFromFirebase(id);
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
      <div className="mt-3 border-l-4 border-gray-300 px-6">
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
          <Button
            type="button"
            variant={"purple"}
            size={"xs"}
            onClick={() => commentHandler()}
          >
            {isEditStatus ? "更新留言" : "新增留言"}
          </Button>

          {isEditStatus && (
            <Button
              type="button"
              variant={"ghost"}
              size={"xs"}
              onClick={() => cancelEditHandler()}
            >
              取消
            </Button>
          )}
        </div>
      </div>

      {/* divider */}
      {!isLoading && nestCommentList.length > 0 && (
        <div className="mt-3 w-full border-b bg-gray-300"></div>
      )}

      {/* comments */}
      <div className="mt-3 h-full overflow-hidden px-6">
        {isLoading && (
          <div
            className="grid items-center justify-center"
            style={{
              height: "calc(100% - 214.34px)",
            }}
          >
            <p>is loading...</p>
          </div>
        )}

        {/* real time comments */}
        {!isLoading && nestCommentList.length < 1 && (
          <div
            className="grid items-center justify-center"
            style={{
              height: "calc(100% - 214.34px)",
            }}
          >
            <div className="flex flex-col text-center text-sm text-gray-500">
              <i className="">No comments for this comment.</i>
              <i className="">Be the first to respond.</i>
            </div>
          </div>
        )}

        {/* all comments */}
        {!isLoading && nestCommentList.length > 0 && (
          <ScrollArea
            style={{
              height: "calc(100% - 214.24px)",
            }}
          >
            <div className="flex flex-col gap-3 pr-2">
              {nestCommentList.map((item: CommentInfo) => {
                const {
                  id: commentId,
                  userId,
                  userName,
                  userImage,
                  comment,
                  created_at,
                  isEdited,
                  likes,
                } = item;
                return (
                  <div
                    key={commentId}
                    className=" flex flex-col gap-1 border-b border-gray-300 pb-3 last:border-none"
                  >
                    <div className="flex items-center">
                      <img
                        src={userImage}
                        alt="user-image"
                        className="h-8 w-8 rounded-full border border-black"
                      />

                      <div className="ml-2">
                        {user && userId === user.id ? (
                          <h4 className="flex items-center font-medium">
                            {userName}
                            <span className="ml-2 mt-[2px] h-4 rounded-sm bg-gray-200 px-[6px] text-[11px] font-normal text-gray-500">
                              YOU
                            </span>
                          </h4>
                        ) : author && userId === author.id ? (
                          <h4 className="flex items-center font-medium">
                            {userName}
                            <span className="ml-2 mt-[2px] h-4 rounded-sm bg-clay-yellow px-[6px] text-[11px] font-normal text-white">
                              AUTHOR
                            </span>
                          </h4>
                        ) : (
                          <h4 className="font-medium">{userName}</h4>
                        )}

                        <p className="text-xs text-gray-700">
                          {calculateTimeAgo(created_at)}&nbsp;
                          {isEdited && <span>(edited)</span>}
                        </p>
                      </div>

                      {user && userId === user.id && (
                        <div className="ml-auto flex gap-2 pr-2">
                          <span
                            className="cursor-pointer text-xs text-olive/80 underline hover:text-olive"
                            onClick={() => getCommentHandler(commentId)}
                          >
                            Edit
                          </span>
                          <span
                            className="cursor-pointer text-xs text-clay-red/80 underline hover:text-clay-red"
                            onClick={() => deleteButtonHandler(commentId)}
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </div>

                    {/* comment */}
                    <div
                      className="text-sm text-black/80"
                      style={{ width: "318px" }}
                    >
                      <div className="ql-snow">
                        <div className="ql-editor pl-0 pr-0" data-gramm="false">
                          <Markup content={comment} />
                        </div>
                      </div>
                    </div>

                    {/* like and reply */}
                    <div className="flex items-center justify-between pr-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-900">
                          {user && userId === user.id ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <RiHeartFill className="mt-[2px] h-5 w-5 text-gray-200 hover:cursor-not-allowed" />
                                </TooltipTrigger>
                                <TooltipContent className="border-black">
                                  <p className="text-sm">
                                    You cannot like your comment
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : user && likes.includes(user.id) ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <RiHeartFill className="text-red mt-[2px] h-5 w-5 duration-150" />
                                </TooltipTrigger>
                                <TooltipContent className="border-black">
                                  <p className="text-sm">
                                    You already liked this comment
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <RiHeartLine
                              className="mt-[2px] h-5 w-5 duration-150 hover:cursor-pointer hover:text-gray-400"
                              onClick={() => likeHandler(commentId)}
                            />
                          )}

                          {likes.length}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* alert */}
        {showAlert && (
          <>
            <div
              className="fixed left-0 top-0 z-50 h-full bg-transparent"
              style={{ width: "calc(100% - 380px)" }}
            ></div>

            <div
              className="fixed right-0 top-0 z-50 flex h-full w-[380px] items-center justify-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.96)" }}
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={topVariant}
                viewport={{ once: true }}
                className="flex flex-col text-center font-helvetica"
              >
                <h3 className="text-xl font-bold">Delete Comment</h3>
                <p className="mx-auto mt-3 w-[80%] text-sm text-gray-500">
                  Deletion is not reversible, and the comment will be completely
                  removed from public view.
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  Still want to proceed?
                </p>

                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    type="button"
                    variant={"turquoise-hipster"}
                    size={"sm"}
                    onClick={() => {
                      setShowAlert(false);
                      setShouldDeleteId("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant={"pink-hipster"}
                    size={"sm"}
                    onClick={() => deleteCommentHandler()}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ArticleNestedCommentsContainer;
