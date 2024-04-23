import React from "react";
import {
  HeatArticlesContainer,
  NewbieArticlesContainer,
  LatestArticlesContainer,
} from "../components";

const Articles: React.FC = () => {
  return (
    <div className="mx-auto flex w-[90%] max-w-5xl flex-col gap-16 py-14">
      <HeatArticlesContainer />
      <NewbieArticlesContainer />
      <LatestArticlesContainer />
    </div>
  );
};

export default Articles;
