import React, { useEffect, useState, KeyboardEvent, useRef } from "react";
import axios from "axios";
import UnsplashImagesContainer from "./UnsplashImagesContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  setUnsplashData,
  setTypeText,
  setSearchText,
  setPage,
} from "../features/article/articleSlice";
import { IRootState } from "../store";

// react icons
import { IoSearchOutline } from "react-icons/io5";

// shadcn
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const UnsplashContainer: React.FC = () => {
  const { page, searchText, typeText } = useSelector(
    (state: IRootState) => state.article,
  );
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const enterHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && typeText) {
      const trimSearchText = typeText.trim();
      dispatch(setSearchText(trimSearchText));
    }
  };

  const loadMoreHandler = () => {
    dispatch(setPage(page + 1));
  };

  const fetchSearchImages = async () => {
    const searchUrl = `https://api.unsplash.com/search/photos/?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&query=${searchText}&orientation=landscape&per_page=12&page=${page}`;

    setIsLoading(true);

    try {
      const response = await axios.get(searchUrl);
      dispatch(setUnsplashData(response.data.results));
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const fetchSurfImages = async () => {
    const surfUrl = `https://api.unsplash.com/search/photos/?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&query=surf&orientation=landscape&per_page=12&page=${page}`;

    setIsLoading(true);

    try {
      const response = await axios.get(surfUrl);
      dispatch(setUnsplashData(response.data.results));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!searchText && page === 1) {
      // console.log("execute1");
      fetchSurfImages();
    }
  }, [page]);

  useEffect(() => {
    if (!searchText && page !== 1) {
      // console.log("execute2");
      fetchSurfImages();
    }
  }, [page]);

  useEffect(() => {
    if (searchText && page !== 1) {
      // console.log("execute3");
      dispatch(setPage(1));
    }
    if (searchText && page === 1) {
      // console.log("execute3.5");
      fetchSearchImages();
    }
  }, [searchText]);

  useEffect(() => {
    if (searchText) {
      // console.log("execute4");
      fetchSearchImages();
    }
  }, [page]);

  return (
    <SheetContent className="w-[380px]">
      <aside className="flex h-full w-full flex-col">
        {/* title */}
        <SheetHeader className="flex">
          <SheetTitle className="border-b border-gray-300 pb-3 text-center text-xl font-bold text-black">
            Photos by&nbsp;
            <a
              href="https://unsplash.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-navy"
            >
              Unsplash
            </a>
          </SheetTitle>
        </SheetHeader>

        {/* search input */}
        <div className="relative mt-3 flex w-full items-center">
          <input
            type="text"
            ref={inputRef}
            placeholder="Type keywords and press Enter"
            className="h-8 w-full grow  pl-[30px] outline-none"
            onChange={(e) => dispatch(setTypeText(e.target.value))}
            onKeyDown={enterHandler}
          />
          <div className="absolute left-[4px] top-[8px]">
            <IoSearchOutline className="text-lg" style={{ color: "#a3a3a3" }} />
          </div>
          <kbd className="kbd kbd-sm mt-[2px] px-3">Enter</kbd>
        </div>

        {/* container */}
        <ScrollArea
          className={`mt-5 h-[508px] w-full ${isLoading ? "relative" : ""}`}
        >
          {isLoading ? (
            <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
              Loading...
            </div>
          ) : (
            <UnsplashImagesContainer />
          )}
        </ScrollArea>

        {/* button */}
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant={"clay-red-hipster"}
            onClick={loadMoreHandler}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : null}
            {isLoading ? "Loading" : "Load More"}
          </Button>
        </div>
      </aside>
    </SheetContent>
  );
};

export default UnsplashContainer;
