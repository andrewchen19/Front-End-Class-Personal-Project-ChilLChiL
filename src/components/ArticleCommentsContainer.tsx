import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { calculateTimeAgo } from "../utils";
import { CommentInfo } from "../types";

// nano id
import { nanoid } from "nanoid";

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

// framer motion
import { motion, Variants } from "framer-motion";
const topVariant: Variants = {
  hidden: { y: "-30px" },
  visible: { y: 0, transition: { duration: 1.2 } },
};

// shadcn
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const ArticleCommentsContainer: React.FC = () => {
  const { id } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [commentLength, setCommentLength] = useState<number>(0);
  const [commentList, setCommentList] = useState<DocumentData | []>([]);
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<DocumentData | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [shouldDeleteId, setShouldDeleteId] = useState<string>("");

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

      // console.log("execute");

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
    <SheetContent className="w-[380px]">
      <aside className="h-full w-full">
        {/* title */}
        <SheetHeader className="flex">
          <SheetTitle className="text-xl font-bold text-black">
            Comment&nbsp;(<span>{commentLength}</span>)
          </SheetTitle>
        </SheetHeader>

        {/* comments */}
        <div className="mt-3 h-full overflow-hidden">
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
              size={"sm"}
              onClick={() => commentHandler()}
            >
              {isEditStatus ? "更新留言" : "新增留言"}
            </Button>

            {isEditStatus && (
              <Button
                type="button"
                variant={"ghost"}
                size={"sm"}
                onClick={() => cancelEditHandler()}
              >
                取消
              </Button>
            )}
          </div>

          {isLoading && <div className="mt-3">is loading...</div>}

          {/* real time comments */}
          {!isLoading && commentList.length < 1 && (
            <p className="mt-3">目前尚未有留言.....</p>
          )}

          {/* latest 10 comments */}
          {!isLoading && commentList.length > 0 && (
            <ScrollArea
              className="mt-3"
              style={{
                height: "calc(100% - 169.34px)",
              }}
            >
              <div className="flex flex-col gap-3 pr-2">
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
                    <div key={commentId} className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <img
                          src={userImage}
                          alt="user-image"
                          className="h-8 w-8 rounded-full"
                        />

                        <div>
                          {user && userId === user.id ? (
                            <h4 className="ml-1 font-medium">
                              {userName} (You)
                            </h4>
                          ) : (
                            <h4 className="ml-1 font-medium">{userName}</h4>
                          )}

                          <p className="ml-1 text-xs text-gray-700">
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

                      <div
                        className="rounded-lg  bg-gray-300 text-sm text-black/80"
                        style={{ width: "322px" }}
                      >
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
            </ScrollArea>
          )}
        </div>
      </aside>

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
    </SheetContent>
  );
};

export default ArticleCommentsContainer;
