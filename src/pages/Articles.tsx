import React from "react";
import {
  AllArticlesContainer,
  HeatArticlesContainer,
  NewbieArticlesContainer,
  LatestArticlesContainer,
} from "../components";

const Articles: React.FC = () => {
  return (
    <div className="mx-auto flex w-[90%] max-w-5xl flex-col gap-16 py-14">
      <HeatArticlesContainer />
      <LatestArticlesContainer />
      <NewbieArticlesContainer />
      <AllArticlesContainer />
    </div>
  );
};

export default Articles;
