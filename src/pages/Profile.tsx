import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { openEditContainer } from "../features/user/userSlice";
import { IRootState } from "../store";
import { RealtimeContainer, ProfileEditContainer } from "../components";

import setting from "../assets/icons/setting.svg";

const Profile: React.FC = () => {
  const { user, isEditContainerOpen } = useSelector(
    (state: IRootState) => state.user,
  );
  const dispatch = useDispatch();

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/log-in" />;
  }

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (isEditContainerOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    // Ensure scrolling is re-enabled when component unmounts
    return () => {
      body.style.overflow = "auto";
    };
  }, [isEditContainerOpen]);

  return (
    <main className="align-profile gap-20 py-24">
      {/* personal info */}
      <section>
        <h2 className="text-2xl font-bold"></h2>
        <div className="flex items-center gap-6">
          <img src={setting} alt="image" className="ml-2 h-8 w-8" />
          <h2 className="text-2xl font-bold">個人資訊</h2>
        </div>

        <div className="mt-10 flex items-center gap-10">
          <img
            src={user.profile_picture}
            alt="user-image"
            className="h-32 w-32 rounded-full border-4 border-turquoise"
          />

          <div className="flex flex-col gap-5 font-semibold">
            <h4 className="capitalize">
              姓名：
              <span className="font-ppwoodland pl-2">{user.name}</span>
            </h4>
            <p>
              信箱：
              <span className="font-ppwoodland pl-2">{user.email}</span>
            </p>

            <div>
              <button
                className="link text-sm text-gray-400 duration-300 hover:text-gray-500"
                onClick={() => dispatch(openEditContainer())}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      <RealtimeContainer />

      {isEditContainerOpen && <ProfileEditContainer />}
    </main>
  );
};

export default Profile;
