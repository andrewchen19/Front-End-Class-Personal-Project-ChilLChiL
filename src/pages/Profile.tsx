import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { openEditContainer } from "../features/user/userSlice";
import { IRootState } from "../store";
import { RealtimeContainer, ProfileEditContainer } from "../components";

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

  return (
    <main className="align-profile gap-20 py-24">
      {/* personal info */}
      <section>
        <h2 className="text-2xl font-bold">個人訊息</h2>

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
                className="link text-sm text-gray-500 duration-300 hover:text-gray-600"
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
