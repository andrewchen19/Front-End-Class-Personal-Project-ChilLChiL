import React, { FormEvent, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";

// firebase
import { db } from "../main";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function getUserFromFirebase(id: string): Promise<void> {
    const q = query(collection(db, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      dispatch(setUser(user));
      toast.success("Login Successful 😎");
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please Provide All Values 😬");
      return;
    }

    // sign in with firebase authentication
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        if (user) {
          const id = user.uid;
          getUserFromFirebase(id);
        }
      })
      .catch((error) => {
        const errorCode = error.code;

        if (!errorCode) return;

        if (errorCode.includes("invalid-credential")) {
          toast.error("Invalid Credential 😵");
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
            className="hover:border-red-200 hover:text-red-200 border-2 border-black p-2 font-semibold text-black"
          >
            Login
          </button>
        </div>
      </form>

      <div className="mx-auto max-w-96 px-8">
        <h3 className="text-center font-notosans text-lg font-bold tracking-wide text-gray-500">
          還沒有帳號?
          <NavLink to="/sign-up" className="pl-4 text-turquoise">
            立即註冊
          </NavLink>
        </h3>
      </div>
    </>
  );
};

export default Login;
