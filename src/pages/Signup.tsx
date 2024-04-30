import React, { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserInfo } from "../types";

import { db } from "../main";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const addDocToFirebase = async (userInfo: UserInfo): Promise<void> => {
    await setDoc(doc(db, "users", userInfo.id), userInfo);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warning("Please Provide All Values 😬");
      return;
    }

    // sign up with firebase authentication
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;

        if (user) {
          const id = user.uid;
          const userInfo = {
            id,
            name,
            email,
            profile_picture:
              "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen1.png?alt=media&token=a991ddf6-2639-4617-97c7-0b9d3a2b6cba",
            theme: "light",
            articlesCollection: [],
            localSpotsCollection: [],
            foreignSpotsCollection: [],
          };
          addDocToFirebase(userInfo);
        }

        toast.success("Sign up successful 😎");
        setTimeout(() => {
          navigate("/log-in");
        }, 1000);
      })
      .catch((error) => {
        const errorCode = error.code;

        if (!errorCode) return;

        if (errorCode.includes("email-already-in-use")) {
          toast.error("Email is already in use 😵");
        }

        if (errorCode.includes("weak-password")) {
          toast.error("Password should be at least 6 characters 😵");
        }
      });
  };

  return (
    <>
      <header className="flex h-20 items-center border-b border-gray-300 bg-white text-black">
        <div className="mx-auto flex w-[95%] items-center justify-between">
          <NavLink to="/">
            <h1 className="font-superglue text-2xl tracking-widest text-turquoise">
              ChilLChilL
            </h1>
          </NavLink>
        </div>
      </header>

      <form
        className="mx-auto flex max-w-96 flex-col gap-y-4 p-8"
        onSubmit={(e) => submitHandler(e)}
      >
        <div className="flex flex-col gap-y-2">
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
        <div className="flex flex-col gap-y-2">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="user-email"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="border-2 border-black p-2 font-semibold text-black"
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="mx-auto max-w-96 px-8">
        <h3 className="text-center font-notosans text-lg font-bold tracking-wide text-gray-500">
          已經有帳號?
          <NavLink to="/log-in" className="pl-4 text-turquoise">
            立即登入
          </NavLink>
        </h3>
      </div>
    </>
  );
};

export default Signup;
