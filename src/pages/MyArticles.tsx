import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";

import {
  ProfileNavbar,
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
    <div className="mx-auto flex w-[90%] max-w-6xl gap-10">
      <ProfileNavbar />

      <div className="my-20 flex w-full flex-col gap-10 px-10">
        <MyArticlesCollectionContainer />
        <ArticlesCollectionContainer />
      </div>
    </div>
  );
};

export default MyArticles;
