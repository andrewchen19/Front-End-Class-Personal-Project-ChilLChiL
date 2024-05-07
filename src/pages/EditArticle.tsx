import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { UnsplashContainer, Blocker } from "../components";
import { localSpotsList } from "../utils";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  openUnsplash,
  setCover,
  resetCover,
} from "../features/article/articleSlice";
import { IRootState } from "../store";

// icons
import backpack from "../assets/icons/backpack.svg";
import certificate from "../assets/icons/certificate.svg";
import guitar from "../assets/icons/guitar.svg";
import lightBulbs from "../assets/icons/light-bulbs.svg";
import smileyFace from "../assets/icons/smiley-face.svg";
import trumpet from "../assets/icons/trumpet.svg";

// firebase
import { db } from "../main";
import { doc, getDoc, updateDoc, DocumentData } from "firebase/firestore";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// framer motion
import { motion } from "framer-motion";

// shadcn
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const EditArticle: React.FC = () => {
  const { id } = useParams();
  const { user } = useSelector((state: IRootState) => state.user);
  const { cover, isUnsplashOpen, photographerLink, photographerName } =
    useSelector((state: IRootState) => state.article);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [article, setArticle] = useState<DocumentData | null>(null);
  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [surfingSpot, setSurfingSpot] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [clickSubmit, setClickSubmit] = useState<boolean>(false);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

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
        photographerLink,
        photographerName,
      });
      setClickSubmit(true);
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

  if (isLoading || !article) {
    return <div>Loading...</div>;
  }

  const isEdited: boolean =
    (article.title !== title ||
      article.tag !== tag ||
      article.surfingSpot !== surfingSpot ||
      article.content !== content ||
      article.cover !== cover) &&
    !clickSubmit;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* caption */}
      <div className="grid h-[150px] w-full place-items-center bg-beige">
        <h1 className="font-veneer text-3xl leading-8 tracking-wide">
          <span className="text-green-fluorescent">Update</span> your surf
          stories and keep the waves rolling
        </h1>
      </div>

      <div className="align-container gap-20 py-24">
        {/* cover */}
        <div>
          <h3 className="mb-2 text-2xl font-semibold">封面</h3>
          <div
            className={`relative h-[450px] w-full border border-dashed border-gray-500 ${
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
              <Sheet>
                <h5 className="absolute -bottom-[30px] left-0 font-sriracha text-[14px] font-medium text-gray-500">
                  Change another cover?&nbsp;
                  <SheetTrigger>
                    <span
                      className="font-semibold text-clay-yellow hover:cursor-pointer hover:underline hover:underline-offset-4"
                      onClick={() => dispatch(openUnsplash())}
                    >
                      Unsplash
                    </span>
                  </SheetTrigger>
                </h5>
                <UnsplashContainer />
              </Sheet>
            )}
          </div>
        </div>

        {/* title */}
        <div className="mt-[20px]">
          <h3 className="mb-2 text-xl font-semibold">標題</h3>
          <input
            type="text"
            className="input input-sm rounded-lg border border-gray-300 px-4 py-2 outline-none focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* tag */}
        <div>
          <h3 className="mb-2 text-xl font-semibold">類型</h3>

          <div className="grid grid-cols-[auto,auto,auto] items-center gap-y-3">
            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="tag"
                id="travel"
                value="travel"
                checked={tag === "travel"}
                onChange={(e) => setTag(e.target.value)}
              />
              <label htmlFor="travel">旅遊雜記</label>
              <img src={guitar} alt="guitar" className="h-6 w-6" />
            </div>

            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="tag"
                id="gear"
                value="gear"
                checked={tag === "gear"}
                onChange={(e) => setTag(e.target.value)}
              />
              <label htmlFor="gear">裝備介紹</label>
              <img src={backpack} alt="backpack" className="h-7 w-7" />
            </div>

            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="tag"
                id="knowledge"
                value="knowledge"
                checked={tag === "knowledge"}
                onChange={(e) => setTag(e.target.value)}
              />
              <label htmlFor="knowledge">知識技巧</label>
              <img src={lightBulbs} alt="light bulbs" className="h-7 w-7" />
            </div>

            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="tag"
                id="life"
                value="life"
                checked={tag === "life"}
                onChange={(e) => setTag(e.target.value)}
              />
              <label htmlFor="life">生活分享</label>
              <img src={smileyFace} alt="smiley face" className="h-6 w-6" />
            </div>

            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="tag"
                id="activity"
                value="activity"
                checked={tag === "activity"}
                onChange={(e) => setTag(e.target.value)}
              />
              <label htmlFor="activity">活動競賽</label>
              <img src={certificate} alt="certificate" className="h-7 w-7" />
            </div>

            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="tag"
                id="secondhand"
                value="secondhand"
                checked={tag === "secondhand"}
                onChange={(e) => setTag(e.target.value)}
              />
              <label htmlFor="secondhand">二手拍賣</label>
              <img src={trumpet} alt="trumpet" className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* surfingSpot */}
        <div>
          <h3 className="mb-2 text-xl font-semibold">相關浪點</h3>

          <div>
            <select
              name="surfingSpot"
              value={surfingSpot}
              className="select select-sm focus:outline-none"
              onChange={(e) => setSurfingSpot(e.target.value)}
            >
              {localSpotsList.map((item) => {
                return (
                  <option key={item.eng} value={item.eng}>
                    {item.chin}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* content */}
        <div>
          <h3 className="mb-2 text-xl font-semibold">內文</h3>

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
        <div className="mb-10 mt-6 flex gap-4">
          <Button type="button" variant={"purple"} onClick={editHandler}>
            更新文章
          </Button>

          <Button
            type="button"
            variant={"ghost"}
            onClick={() => navigate(`/articles/${id}`)}
          >
            取消
          </Button>
        </div>
      </div>

      <Blocker isEdited={isEdited} />
    </motion.main>
  );
};

export default EditArticle;
