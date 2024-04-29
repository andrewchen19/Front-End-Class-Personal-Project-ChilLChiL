import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IRootState } from "../store";
import { ProfileNavbar } from "../components";

const Profile: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-auto flex w-[90%] max-w-6xl gap-10">
      <ProfileNavbar />

      <div className="mt-20 w-full px-10">
        <h2 className="text-2xl font-bold">我的個人資訊:</h2>

        <div className="mt-10 flex items-center gap-10">
          <img
            src={user.profile_picture}
            alt="user-image"
            className="h-32 w-32 rounded-full border-4 border-turquoise"
          />

          <div className="flex flex-col gap-5 font-semibold">
            <h4 className="capitalize">
              姓名：<span className="font-ppwoodland pl-2">{user.name}</span>
            </h4>
            <p>
              信箱：
              <span className="font-ppwoodland pl-2">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
