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

// framer motion
import { motion } from "framer-motion";

// shadcn
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    const trimName = name.trim();
    if (!trimName) {
      toast.warning("Please provide your name 😬");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        name: trimName,
        profile_picture: profileImage,
      };
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

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
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
        <ScrollArea className="mt-6 h-[270px] rounded-lg  bg-gray-200 pr-2">
          <div className="my-4 grid grid-cols-[auto,auto,auto] justify-around gap-4">
            {profileImageList.map((url, index) => {
              return (
                <div
                  key={index}
                  className={`h-28 w-28 rounded-full border-[3px] border-black hover:cursor-pointer ${url === profileImage ? "border-turquoise" : ""}`}
                  onClick={() => setProfileImage(url)}
                >
                  <img src={url} alt="avatar-image" className="h-full w-full" />
                </div>
              );
            })}
          </div>
        </ScrollArea>

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
      </motion.div>
    </>
  );
};

export default ProfileEditContainer;
