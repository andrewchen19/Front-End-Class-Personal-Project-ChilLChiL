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

  const [isMouserEnter, setIsMouserEnter] = useState(false);
  const [hoverId, setHoverId] = useState("");

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
    <div className="grid grid-cols-3 gap-2">
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
              className="h-full w-full object-cover object-center hover:cursor-pointer"
              onClick={() => clickHandler(urls.raw, user.links.html, user.name)}
            />
            <span
              className={`absolute bottom-0 left-0 text-pink ${
                isMouserEnter && hoverId === id ? "block" : "hidden"
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
