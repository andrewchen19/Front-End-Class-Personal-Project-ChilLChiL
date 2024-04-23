import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { UnsplashContainer } from "../components";
import { localSpotsList } from "../utils";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  openUnsplash,
  setCover,
  resetCover,
} from "../features/article/articleSlice";
import { IRootState } from "../store";

// firebase
import { db } from "../main";
import { doc, getDoc, updateDoc, DocumentData } from "firebase/firestore";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditArticle: React.FC = () => {
  const { id } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);
  const { cover, isUnsplashOpen } = useSelector(
    (state: IRootState) => state.article,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [article, setArticle] = useState<DocumentData | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [surfingSpot, setSurfingSpot] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  const editHandler = async (): Promise<void> => {
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

    if (!id) return;

    try {
      const now = Date.now();
      const articleRef = doc(db, "articles", id);

      await updateDoc(articleRef, {
        cover,
        title,
        tag,
        surfingSpot,
        content,
        updated_at: now,
      });

      toast.success("Updated successful 🎉");
      setTimeout(() => {
        navigate("/profile/my-articles");
        dispatch(resetCover());
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArticleFromFirebase = async (): Promise<void> => {
    if (!id) return;

    setIsLoading(true);
    try {
      const docRef = doc(db, "articles", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setArticle(docSnap.data());
        setTitle(docSnap.data().title);
        setTag(docSnap.data().tag);
        setSurfingSpot(docSnap.data().surfingSpot);
        setContent(docSnap.data().content);
        dispatch(setCover(docSnap.data().cover));
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticleFromFirebase();
  }, []);

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
  };

  if (isLoading || !article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto w-[70%] max-w-5xl">
      {/* cover */}
      <div className="mt-4">
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

      {/* title */}
      <div className="mt-9">
        <h3>標題</h3>
        <input
          type="text"
          className="border border-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* tag */}
      <div className="mt-4">
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

      {/* surfingSpot */}
      <div className="mt-4">
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

      {/* content */}
      <div className="mt-4">
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

      {/* button */}
      <div className="mb-10 mt-6">
        <button
          type="button"
          className="rounded-lg bg-purple-light px-2 py-1 font-notosans text-xs text-white"
          onClick={editHandler}
        >
          發布文章
        </button>
      </div>

      {isUnsplashOpen && <UnsplashContainer />}
    </div>
  );
};

export default EditArticle;
