import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import {
  MyArticlesCollectionContainer,
  ArticlesCollectionContainer,
} from "../components";

const MyArticles: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  return (
    <div className="align-profile gap-16 py-20 sm:gap-20 sm:py-24">
      <MyArticlesCollectionContainer />
      <ArticlesCollectionContainer />
    </div>
  );
};

export default MyArticles;
