import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UnsplashContainer } from "../components";
import { localSpotsList } from "../utils";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { openUnsplash, resetCover } from "../features/article/articleSlice";
import { IRootState } from "../store";

// firebase
import { db } from "../main";
import { collection, doc, addDoc, setDoc, updateDoc } from "firebase/firestore";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PostArticle: React.FC = () => {
  const { cover, isUnsplashOpen } = useSelector(
    (state: IRootState) => state.article,
  );
  const { user } = useSelector((state: IRootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("旅遊");
  const [surfingSpot, setSurfingSpot] = useState("佳樂水");
  const [content, setContent] = useState("");

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  interface Article {
    id: string;
    authorId: string;
    cover: string;
    title: string;
    tag: string;
    surfingSpot: string;
    created_at: number;
    likes_id: string[] | [];
  }

  const addToSubCollection = async (article: Article): Promise<void> => {
    try {
      const userDocRef = doc(db, "users", article.authorId);
      const subCollectionRef = collection(userDocRef, "my-articles");
      await setDoc(doc(subCollectionRef, article.id), article);
    } catch (error) {
      console.log(error);
    }
  };

  const publishHandler = async (): Promise<void> => {
    if (!cover) {
      toast.warning("Please choose a cover image 😬");
      return;
    }
    if (!title) {
      toast.warning("Title can't be empty 😬");
      return;
    }
    if (!tag) {
      toast.warning("Please choose a tag 😬");
      return;
    }
    if (!surfingSpot) {
      toast.warning("Please choose a surfingSpot 😬");
      return;
    }
    if (!content) {
      toast.warning("Content can't be empty 😬");
      return;
    }

    try {
      const now = Date.now();
      const docRef = await addDoc(collection(db, "articles"), {
        authorId: user.id,
        authorName: user.name,
        authorImage: user.profile_picture,
        cover,
        title,
        tag,
        surfingSpot,
        content,
        created_at: now,
        updated_at: now,
        likes_id: [],
      });

      await updateDoc(docRef, {
        id: docRef.id,
      });
      await addToSubCollection({
        id: docRef.id,
        authorId: user.id,
        cover,
        title,
        tag,
        surfingSpot,
        created_at: now,
        likes_id: [],
      });
      toast.success("Publish successful 🎉");
      setTimeout(() => {
        navigate("/profile/my-articles");
        dispatch(resetCover());
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
  };

  return (
    <>
      <div className="mx-auto mt-4 w-[70%] max-w-5xl">
        <h3>封面</h3>
        <div
          className={`relative h-[300px] max-w-[1280px] border border-dashed border-black ${
            cover ? "" : "grid place-items-center"
          }`}
        >
          {cover && (
            <img
              src={cover}
              className="h-full w-full object-cover object-center"
            ></img>
          )}
          {!cover && (
            <p>
              Choose cover from&nbsp;
              <span
                onClick={() => dispatch(openUnsplash())}
                className="text-purple-bright hover:cursor-pointer"
              >
                Unsplash
              </span>
            </p>
          )}
          {cover && (
            <h5 className="absolute -bottom-[30px] left-0">
              Change another cover?&nbsp;
              <span
                onClick={() => dispatch(openUnsplash())}
                className="text-purple-bright hover:cursor-pointer"
              >
                Unsplash
              </span>
            </h5>
          )}
        </div>
      </div>

      <div className="mx-auto mt-9 w-[70%] max-w-5xl">
        <h3>標題</h3>
        <input
          type="text"
          className="border border-black"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mx-auto mt-4 w-[70%] max-w-5xl">
        <h3>類型</h3>

        <div className="flex gap-2">
          <div>
            <input
              type="radio"
              name="tag"
              id="travel"
              value="旅遊"
              checked={tag === "旅遊"}
              onChange={(e) => setTag(e.target.value)}
            />
            <label htmlFor="travel">旅遊</label>
          </div>
          <div>
            <input
              type="radio"
              name="tag"
              id="knowledge"
              value="知識"
              checked={tag === "知識"}
              onChange={(e) => setTag(e.target.value)}
            />
            <label htmlFor="knowledge">知識</label>
          </div>
          <div>
            <input
              type="radio"
              name="tag"
              id="gear"
              value="裝備"
              checked={tag === "裝備"}
              onChange={(e) => setTag(e.target.value)}
            />
            <label htmlFor="gear">裝備</label>
          </div>
          <div>
            <input
              type="radio"
              name="tag"
              id="activity"
              value="活動"
              checked={tag === "活動"}
              onChange={(e) => setTag(e.target.value)}
            />
            <label htmlFor="activity">活動</label>
          </div>
          <div>
            <input
              type="radio"
              name="tag"
              id="others"
              value="其他"
              checked={tag === "其他"}
              onChange={(e) => setTag(e.target.value)}
            />
            <label htmlFor="others">其他</label>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 w-[70%] max-w-5xl">
        <h3>相關浪點</h3>

        <div>
          <select
            className="select select-bordered select-secondary"
            name="surfingSpot"
            value={surfingSpot}
            onChange={(e) => setSurfingSpot(e.target.value)}
          >
            {localSpotsList.map((item) => {
              return (
                <option key={item.chin} value={item.chin}>
                  {item.chin}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="mx-auto mt-4 w-[70%] max-w-5xl">
        <h3>內文</h3>
        <div>
          <ReactQuill
            theme="snow"
            value={content}
            modules={modules}
            onChange={setContent}
            placeholder="請輸入內容 ..."
          />
        </div>
      </div>

      <div className="mx-auto mb-10 mt-4  w-[70%] max-w-5xl ">
        <button type="button" className="bg-gray-400" onClick={publishHandler}>
          發布文章
        </button>
      </div>

      {isUnsplashOpen && <UnsplashContainer />}
    </>
  );
};

export default PostArticle;
