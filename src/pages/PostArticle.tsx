import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UnsplashContainer, Blocker } from "../components";
import { localSpotsList, isOnlyEmptyParagraphs } from "../utils";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { resetCover, openUnsplash } from "../features/article/articleSlice";
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
import { collection, addDoc, updateDoc } from "firebase/firestore";

// React Quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// framer motion
import { motion } from "framer-motion";

// shadcn
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PostArticle: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const { cover, photographerLink, photographerName } = useSelector(
    (state: IRootState) => state.article,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("travel");
  const [surfingSpot, setSurfingSpot] = useState<string>("jialeshuei");
  const [content, setContent] = useState<string>("");
  const [clickSubmit, setClickSubmit] = useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

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
    if (!content || isOnlyEmptyParagraphs(content)) {
      toast.warning("Content can't be empty 😬");
      return;
    }

    setIsButtonLoading(true);

    try {
      const now = Date.now();
      const articleRef = await addDoc(collection(db, "articles"), {
        authorId: user.id,
        cover,
        title,
        tag,
        surfingSpot,
        content,
        created_at: now,
        updated_at: now,
        likes_amount: 0,
        photographerLink,
        photographerName,
        isDeleted: false,
      });
      await updateDoc(articleRef, {
        id: articleRef.id,
      });
      setClickSubmit(true);
      toast.success("Published successfully 🎉");
      setTimeout(() => {
        navigate("/profile/my-articles");
        dispatch(resetCover());
      }, 1000);
    } catch (error) {
      console.log(error);
    }

    setIsButtonLoading(false);
  };

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

  const isEdited: boolean =
    (!!cover ||
      !!title ||
      tag !== "travel" ||
      surfingSpot !== "jialeshuei" ||
      (!!content && content !== "<p><br></p>")) &&
    !clickSubmit;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* caption */}
      <div className="grid h-[200px] place-items-center bg-beige">
        <div className="mx-auto w-[80%]">
          <h1 className="text-center font-veneer text-2xl leading-8 tracking-wide sm:text-3xl">
            <span className="text-green-fluorescent">Start</span> your journey
            as a surfing storyteller today
          </h1>
        </div>
      </div>

      <div className="align-container gap-10 py-12 sm:gap-20 sm:py-24">
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
            {!cover && (
              <Sheet>
                <p className="font-sriracha text-[18px] font-medium">
                  Choose cover from&nbsp;
                  <SheetTrigger>
                    <span
                      className="font-semibold text-clay-yellow hover:cursor-pointer hover:underline hover:underline-offset-4"
                      onClick={() => dispatch(openUnsplash())}
                    >
                      Unsplash
                    </span>
                  </SheetTrigger>
                </p>
                <UnsplashContainer />
              </Sheet>
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
        <div className="relative mt-[20px]">
          <Label className="text-xl font-semibold">標題</Label>
          <Input
            type="text"
            className="mt-2 w-[300px] rounded-lg border border-gray-300 px-4 py-2"
            value={title}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
            aria-describedby="titleHelp"
          />
          {title.length === 50 && (
            <small
              id="titleHelp"
              className="absolute -bottom-[28px] left-0 text-red"
            >
              Limit to 50 characters
            </small>
          )}
        </div>

        {/* tag */}
        <div>
          <h3 className="mb-2 text-xl font-semibold">類型</h3>

          <div className="grid grid-cols-[auto,auto] items-center gap-y-3 sm:grid-cols-[auto,auto,auto]">
            <div className="flex items-center gap-1">
              <input
                type="radio"
                name="tag"
                id="travel"
                value="travel"
                className="bg-white"
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
                className="bg-white"
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
                className="bg-white"
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
                className="bg-white"
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
                className="bg-white"
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
                className="bg-white"
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
              className="select select-sm border-gray-300 bg-white focus:outline-none"
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
        <div className="mb-10 flex gap-4">
          <Button
            type="button"
            variant={"purple"}
            onClick={publishHandler}
            disabled={isButtonLoading}
          >
            {isButtonLoading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : null}
            {isButtonLoading ? "發布中" : "發布文章"}
          </Button>

          <Button
            type="button"
            variant={"ghost"}
            disabled={isButtonLoading}
            onClick={() => navigate(`/profile/my-articles`)}
          >
            取消
          </Button>
        </div>
      </div>

      <Blocker isEdited={isEdited} />
    </motion.main>
  );
};

export default PostArticle;
