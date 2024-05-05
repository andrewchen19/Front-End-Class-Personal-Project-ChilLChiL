import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeUnsplash,
  resetUnsplashData,
  setCover,
  setPhotographer,
} from "../features/article/articleSlice";
import { IRootState } from "../store";

// shadcn
import { SheetClose } from "@/components/ui/sheet";

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
    <div className="grid grid-cols-2 gap-4 pr-2">
      {unsplashArray.map((item) => {
        const { id, alt_description, urls, user } = item;
        return (
          <div
            key={id}
            className="relative"
            onMouseEnter={() => enterHandler(id)}
            onMouseLeave={() => leaveHandler(id)}
          >
            <SheetClose asChild>
              <img
                src={urls.regular}
                alt={alt_description}
                className="h-[115px] w-full  rounded-xl object-cover object-center hover:cursor-pointer"
                onClick={() =>
                  clickHandler(urls.raw, user.links.html, user.name)
                }
              />
            </SheetClose>
            {isMouserEnter && hoverId === id && (
              <div className="absolute bottom-0 left-0 grid h-[30px] w-full place-items-center rounded-b-xl bg-black/30">
                <span className="text-nowrap text-sm capitalize text-white">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UnsplashImagesContainer;
