import React, { useEffect, useState, KeyboardEvent, useRef } from "react";
import axios from "axios";
import UnsplashImagesContainer from "./UnsplashImagesContainer";
import { useDispatch } from "react-redux";
import {
  setUnsplashData,
  closeUnsplash,
} from "../features/article/articleSlice";

// react icons
import { MdClose } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

const UnsplashContainer: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useDispatch();

  const enterHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimSearchText = searchText.trim();

      const searchUrl = `https://api.unsplash.com/search/photos/?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&query=${trimSearchText}&orientation=landscape&per_page=12`;
      console.log(searchUrl);
      setIsLoading(true);
      try {
        const response = await axios.get(searchUrl);
        dispatch(setUnsplashData(response.data.results));
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchRandomImage = async () => {
      const randomUrl = `https://api.unsplash.com/photos/random/?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&query=surf&orientation=landscape&count=12`;
      setIsLoading(true);
      try {
        const response = await axios.get(randomUrl);
        dispatch(setUnsplashData(response.data));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    fetchRandomImage();
  }, []);

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-10 h-full w-full hover:cursor-pointer"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        onClick={() => dispatch(closeUnsplash())}
      ></div>

      <div
        className="fixed inset-0 z-20 mx-auto my-[10vh] w-[600px] rounded-xl bg-white p-8"
        style={{ boxShadow: "rgba(6, 2, 2, 0.15) 0px 2px 10px" }}
      >
        {/* close button */}
        <div className="absolute right-6 top-6">
          <button onClick={() => dispatch(closeUnsplash())}>
            <MdClose className="text-2xl text-gray-600 hover:text-gray-700" />
          </button>
        </div>

        {/* search input */}
        <div className="relative flex w-[330px] items-center">
          <input
            type="text"
            ref={inputRef}
            placeholder="Type keywords and press Enter"
            className="h-8 w-full grow pl-[30px] outline-none"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={enterHandler}
          />
          <div className="absolute left-[4px] top-1/2 -translate-y-1/2">
            <IoSearchOutline className="text-lg" style={{ color: "#a3a3a3" }} />
          </div>
          <kbd className="kbd kbd-sm mt-[2px] px-3">Enter</kbd>
        </div>

        <div
          className={`mt-2 h-[454px] justify-around overflow-y-scroll border border-gray-300 p-4 ${
            isLoading ? "grid place-items-center" : ""
          }`}
        >
          {isLoading ? <p>Loading...</p> : <UnsplashImagesContainer />}
        </div>
      </div>
    </>
  );
};

export default UnsplashContainer;
