import React from "react";
import {
  AllArticlesContainer,
  HeatArticlesContainer,
  NewbieArticlesContainer,
  LatestArticlesContainer,
} from "../components";
import bannerImg from "../assets/images/articles-banner.jpg";

const Articles: React.FC = () => {
  return (
    <>
      {/* banner */}
      <div className="relative h-[450px] w-full">
        <img
          src={bannerImg}
          alt="foreign-banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2">
          <h2
            className="font-dripoctober text-6xl tracking-wide text-white"
            style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
          >
            Surfing Blog
          </h2>
        </div>
        <div className="absolute left-[50%] top-[52%] -translate-x-1/2 -translate-y-1/2">
          <p className="font-dripoctober text-clay-yellow">
            Share your epic surf adventures here
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-[90%] max-w-5xl flex-col gap-16 py-14">
        <HeatArticlesContainer />
        <LatestArticlesContainer />
        <NewbieArticlesContainer />
        <AllArticlesContainer />
      </div>
    </>
  );
};

export default Articles;
