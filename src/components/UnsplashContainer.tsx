import React, { useEffect, useState, KeyboardEvent } from "react";
import axios from "axios";
import UnsplashImagesContainer from "./UnsplashImagesContainer";
import { useDispatch } from "react-redux";
import {
  setUnsplashData,
  closeUnsplash,
} from "../features/article/articleSlice";

const UnsplashContainer: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const enterHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimSearchText = searchText.trim();

      const searchUrl = `https://api.unsplash.com/search/photos/?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&query=${trimSearchText}&orientation=landscape&per_page=15`;
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
      const randomUrl = `https://api.unsplash.com/photos/random/?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&query=surf&orientation=landscape&count=15`;
      setIsLoading(true);
      try {
        const response = await axios.get(randomUrl);
        dispatch(setUnsplashData(response.data));
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    fetchRandomImage();
  }, []);

  return (
    <div
      className="fixed inset-0 z-20 grid h-full w-full place-items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="relative flex h-[500px] w-[600px] flex-col gap-4 bg-white px-6 py-10">
        <input
          type="text"
          placeholder="Type keywords and press Enter"
          className="h-8 pl-2"
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={enterHandler}
        />

        <div
          className={`h-full w-full border border-black ${
            isLoading ? "grid place-items-center" : "overflow-auto"
          }`}
        >
          {isLoading ? <p>Loading...</p> : <UnsplashImagesContainer />}
        </div>

        <div
          className="hover:text-red-500 absolute right-[20px] top-[20px] cursor-pointer"
          onClick={() => dispatch(closeUnsplash())}
        >
          X
        </div>
      </div>
    </div>
  );
};

export default UnsplashContainer;
