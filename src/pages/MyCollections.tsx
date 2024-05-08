import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import {
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
    <main className="align-profile gap-20 py-24">
      <LocalSpotsCollectionContainer />
      <ForeignSpotsCollectionContainer />
    </main>
  );
};

export default MyCollections;
