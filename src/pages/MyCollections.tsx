import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import {
  ProfileNavbar,
  LocalSpotsCollectionContainer,
  ForeignSpotsCollectionContainer,
} from "../components";

const MyCollections: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-auto mt-20 grid w-[90%] max-w-6xl grid-cols-[auto,1fr] gap-10">
      <ProfileNavbar />

      <div className="mb-20 flex w-full flex-col gap-10 px-10">
        <LocalSpotsCollectionContainer />
        <ForeignSpotsCollectionContainer />
      </div>
    </div>
  );
};

export default MyCollections;
