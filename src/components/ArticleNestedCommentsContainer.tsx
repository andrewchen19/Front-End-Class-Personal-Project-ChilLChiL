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
  const [nestCommentList, setNestCommentList] = useState<CommentInfo[]>([]);
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<CommentInfo | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [shouldDeleteId, setShouldDeleteId] = useState<string>("");

  const deleteButtonHandler = (nestCommentId: string) => {
    setShowAlert(true);
    setShouldDeleteId(nestCommentId);
  };
  const deleteCommentHandler = async (): Promise<void> => {
    if (!id) return;
    if (!shouldDeleteId) return;

    try {
      const commentRef = doc(db, "articles", id, "comments", commentId);
      const docSnap = await getDoc(commentRef);
      if (!docSnap.exists()) return;

      const newReplies = docSnap
        .data()
        .replies.filter((item: CommentInfo) => item.id !== shouldDeleteId);

      await updateDoc(commentRef, {
        replies: newReplies,
      });

      setComment("");
      setIsEditStatus(false);
      setShouldDeleteId("");
      setShowAlert(false);
      toast.success("Delete comment successful 🎉");
    } catch (error) {
      console.log(error);
    }
  };
  const getCommentHandler = async (nestCommentId: string): Promise<void> => {
    if (!id) return;
    try {
      const commentRef = doc(db, "articles", id, "comments", commentId);
      const docSnap = await getDoc(commentRef);

      if (!docSnap.exists()) return;

      const replies: CommentInfo[] = docSnap.data().replies;
      const obj = replies.find((item) => item.id === nestCommentId);
      if (obj) {
        setIsEditStatus(true);
        setEditInfo(obj);
        setComment(obj.comment);
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
  const likeHandler = async (nestCommentId: string): Promise<void> => {
    if (!id) return;
    if (!user) {
      toast.warning("Please Log In First 😵");
      return;
    }

    try {
      const commentRef = doc(db, "articles", id, "comments", commentId);
      const docSnap = await getDoc(commentRef);
      if (!docSnap.exists()) return;

      const newReplies = docSnap.data().replies.map((item: CommentInfo) => {
        if (item.id === nestCommentId) {
          const newItem = { ...item, likes: [...item.likes, user.id] };
          return newItem;
        }
        return item;
      });

      await updateDoc(commentRef, {
        replies: newReplies,
      });
      toast.success("Like comment successfully 🎉");
    } catch (error) {
      console.log(error);
    }
  };

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
  async function getNestCommentsFromFirebase(): Promise<void> {
    if (!id) return;

    const commentRef = doc(db, "articles", id, "comments", commentId);
    const docSnap = await getDoc(commentRef);
    if (!docSnap.exists()) return;

    if (docSnap.data().replies.length > 0) {
      const nestCommentArray: CommentInfo[] = docSnap.data().replies;
      await getUserInfoFromFirebase(nestCommentArray);
    } else {
      setNestCommentList([]);
    }
  }
  async function addNewNestCommentToFirebase(): Promise<void> {
    if (!id) return;
    if (!user) return;

    const newCommentId = nanoid();

    const commentObj = {
      id: newCommentId,
      userId: user.id,
      comment,
      created_at: Date.now(),
      updated_at: Date.now(),
      isEdited: false,
      likes: [],
    };

    try {
      const commentRef = doc(db, "articles", id, "comments", commentId);
      const docSnap = await getDoc(commentRef);

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
    if (!editInfo) return;

    const commentObj = {
      ...editInfo,
      comment,
      updated_at: Date.now(),
      isEdited: true,
    };

    try {
      const commentRef = doc(db, "articles", id, "comments", commentId);
      const docSnap = await getDoc(commentRef);
      if (!docSnap.exists()) return;

      const newReplies = docSnap.data().replies.map((item: CommentInfo) => {
        if (item.id === commentObj.id) {
          return commentObj;
        }
        return item;
      });

      await updateDoc(commentRef, {
        replies: newReplies,
      });

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

      const commentRef = doc(db, "articles", id, "comments", commentId);

      const unsubscribe = onSnapshot(commentRef, async (doc) => {
        if (doc.exists()) {
          await getNestCommentsFromFirebase();
        } else {
          console.log("Document does not exist");
        }

        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mt-3 border-l-4 border-turquoise px-6">
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

      {/* comments */}
      <div className="mb-1 mt-3 h-full overflow-hidden">
        {isLoading && (
          <div className="grid items-center justify-center px-6">
            <p>is loading...</p>
          </div>
        )}

        {/* real time comments */}
        {!isLoading && nestCommentList.length < 1 && (
          <div className="grid items-center justify-center px-6">
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
            className="border-l-4 border-turquoise px-6"
          >
            <div className="flex flex-col gap-3">
              {nestCommentList.map((item: CommentInfo) => {
                const {
                  id: nestCommentId,
                  userId,
                  userName,
                  userImage,
                  comment,
                  created_at,
                  isEdited,
                  likes,
                } = item;

                return (
                  <div key={nestCommentId} className="flex flex-col gap-1">
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
                        <div className="ml-auto flex gap-2">
                          <span
                            className="cursor-pointer text-xs text-olive/80 underline hover:text-olive"
                            onClick={() => getCommentHandler(nestCommentId)}
                          >
                            Edit
                          </span>
                          <span
                            className="cursor-pointer text-xs text-clay-red/80 underline hover:text-clay-red"
                            onClick={() => deleteButtonHandler(nestCommentId)}
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </div>

                    {/* comment */}
                    <div
                      className="text-sm text-black"
                      style={{ width: "270px" }}
                    >
                      <div className="ql-snow">
                        <div className="ql-editor pl-0 pr-0" data-gramm="false">
                          <Markup content={comment} />
                        </div>
                      </div>
                    </div>

                    {/* like*/}
                    <div className="flex items-center justify-between pr-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-900">
                          {user &&
                          userId === user.id &&
                          likes &&
                          likes.length > 0 ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <RiHeartFill className="text-red mt-[2px] h-5 w-5 hover:cursor-not-allowed" />
                                </TooltipTrigger>
                                <TooltipContent className="border-black">
                                  <p className="text-sm">
                                    You cannot like your comment
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : user &&
                            userId === user.id &&
                            likes &&
                            likes.length < 1 ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <RiHeartLine className="mt-[2px] h-5 w-5 hover:cursor-not-allowed" />
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
                              className="mt-[2px] h-5 w-5 duration-150 hover:cursor-pointer hover:text-gray-500"
                              onClick={() => likeHandler(nestCommentId)}
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
