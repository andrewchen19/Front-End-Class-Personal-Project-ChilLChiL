import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { closeEditContainer, updateUser } from "../features/user/userSlice";
import { IRootState } from "../store";
import { profileImageList } from "../utils";
import { UserInfo } from "../types";

// react icons
import { MdClose } from "react-icons/md";

// firebase
import { db } from "../main";
import { doc, updateDoc } from "firebase/firestore";

// shadcn
import { Button } from "@/components/ui/button";

const ProfileEditContainer: React.FC = () => {
  const { user } = useSelector((state: IRootState) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState<string | "">(user ? user.name : "");
  const [profileImage, setProfileImage] = useState<string | "">(
    user ? user.profile_picture : "",
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // restrict access
  if (!user) {
    toast.warning("Please Log In First 😠");
    return <Navigate to="/log-in" />;
  }

  const updateDataToFirebase = async (updatedUser: UserInfo): Promise<void> => {
    const userRef = doc(db, "users", updatedUser.id);
    updateDoc(userRef, {
      name: updatedUser.name,
      profile_picture: updatedUser.profile_picture,
    });
  };

  const updateHandler = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedUser = { ...user, name, profile_picture: profileImage };
      dispatch(updateUser(updatedUser));
      await updateDataToFirebase(updatedUser);
      toast.success("Updated Successfully 🎉");
    } catch (error) {
      console.log(error);
      toast.error("Updated Unsuccessfully 😵");
    }
    setIsLoading(false);
    dispatch(closeEditContainer());
  };

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-10 h-full w-full hover:cursor-pointer"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        onClick={() => dispatch(closeEditContainer())}
      ></div>

      <div
        className="fixed inset-0 z-20 mx-auto my-auto h-[500px] w-[500px] rounded-xl bg-white p-8"
        style={{ boxShadow: "rgba(6, 2, 2, 0.15) 0px 2px 10px" }}
      >
        {/* close button */}
        <div className="absolute right-8 top-8">
          <button onClick={() => dispatch(closeEditContainer())}>
            <MdClose className="text-2xl text-gray-600 hover:text-gray-700" />
          </button>
        </div>

        {/* name */}
        <div className="mt-4">
          <label htmlFor="name" className="text-sm">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="user-name"
          />
        </div>

        {/* imagesContainer */}
        <div className="mt-6 flex h-[272px] flex-wrap justify-around gap-y-4 overflow-y-scroll border border-gray-300 p-4">
          {profileImageList.map((url, index) => {
            return (
              <div
                key={index}
                className={`h-28 w-28 rounded-full border-2 border-black hover:cursor-pointer ${url === profileImage ? "border-pink" : ""}`}
                onClick={() => setProfileImage(url)}
              >
                <img src={url} alt="avatar-image" className="h-full w-full" />
              </div>
            );
          })}
        </div>

        {/* buttons */}
        <div className="absolute bottom-8 right-8 flex items-center gap-5">
          {!isLoading && (
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => dispatch(closeEditContainer())}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            variant={"purple-hipster"}
            disabled={
              (user.name === name && user.profile_picture === profileImage) ||
              isLoading
            }
            onClick={updateHandler}
          >
            {isLoading ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileEditContainer;
