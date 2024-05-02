import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeUnsplash,
  resetUnsplashData,
  setCover,
  setPhotographer,
} from "../features/article/articleSlice";
import { IRootState } from "../store";

const UnsplashImagesContainer: React.FC = () => {
  const { unsplashArray } = useSelector((state: IRootState) => state.article);
  const dispatch = useDispatch();

  const [isMouserEnter, setIsMouserEnter] = useState<boolean>(false);
  const [hoverId, setHoverId] = useState<string>("");

  const enterHandler = (id: string) => {
    setIsMouserEnter(true);
    setHoverId(id);
  };
  const leaveHandler = (id: string) => {
    setIsMouserEnter(false);
    setHoverId(id);
  };
  const clickHandler = (url: string, link: string, name: string) => {
    const editUrl = url + "&w=1500";
    dispatch(setCover(editUrl));
    dispatch(setPhotographer({ link, name }));
    dispatch(resetUnsplashData());
    dispatch(closeUnsplash());
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {unsplashArray.map((item) => {
        const { id, alt_description, urls, user } = item;
        return (
          <div
            key={id}
            className="relative"
            onMouseEnter={() => enterHandler(id)}
            onMouseLeave={() => leaveHandler(id)}
          >
            <img
              src={urls.regular}
              alt={alt_description}
              className="h-[130px] w-full object-cover object-center hover:cursor-pointer"
              onClick={() => clickHandler(urls.raw, user.links.html, user.name)}
            />
            <span
              className={`${
                isMouserEnter && hoverId === id
                  ? "absolute bottom-1 left-1/2 -translate-x-1/2 text-nowrap text-sm capitalize tracking-wide text-pink"
                  : "hidden"
              }`}
            >
              {user.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default UnsplashImagesContainer;
