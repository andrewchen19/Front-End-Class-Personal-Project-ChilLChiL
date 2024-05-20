import React, { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserInfo } from "../types";
import signupImg from "../assets/images/signup.jpg";

// firebase
import { db } from "../main";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "@firebase/util";

// shadcn
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const addDocToFirebase = async (userInfo: UserInfo): Promise<void> => {
    await setDoc(doc(db, "users", userInfo.id), userInfo);
  };

  const submitHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // regex
    const passwordRegex = /^(?=.*[0-9a-zA-Z])[0-9a-zA-Z]{6,}$/;

    // console.log(passwordRegex.test(password));

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must only contain number, lowercase and uppercase letter 😵",
      );
      return;
    }

    setIsLoading(true);

    // sign up with firebase authentication
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
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
        await addDocToFirebase(userInfo);
      }

      toast.success("Sign up successfully 😎");
      setTimeout(() => {
        navigate("/log-in");
      }, 800);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;

        if (!errorCode) return;

        if (errorCode.includes("email-already-in-use")) {
          toast.error("Email is already in use 😵");
        }

        if (errorCode.includes("auth/invalid-email")) {
          toast.error("Invalid email 😵");
        }

        // if (errorCode.includes("weak-password")) {
        //   toast.error("Password should be at least 6 characters 😵");
        // }
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full border lg:grid lg:grid-cols-2">
      <div className="relative mt-28 flex items-center justify-center lg:mt-0">
        <form
          className="mx-auto grid w-[80%] min-w-[300px] gap-6"
          onSubmit={(e) => submitHandler(e)}
        >
          <div className="grid gap-4 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>

          <div className="grid gap-7">
            <div className="relative grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby="nameHelp"
                autoComplete="user-name"
              />
              {name.length > 20 && (
                <small
                  id="nameHelp"
                  className="absolute -bottom-[20px] left-0 text-red"
                >
                  Limit to 20 characters
                </small>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="chilL@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="user-email"
              />
            </div>

            <div className="relative grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="nameHelp"
                autoComplete="current-password"
              />
              {password.length < 6 && (
                <small
                  id="passwordHelp"
                  className="absolute -bottom-[20px] left-0 text-red"
                >
                  Must be at least 6 characters
                </small>
              )}
            </div>

            <Button
              type="submit"
              size={"xl"}
              className="w-full"
              disabled={
                !name ||
                !email ||
                !password ||
                name.length > 20 ||
                password.length < 6 ||
                isLoading
              }
            >
              {isLoading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : null}
              {isLoading ? "Loading" : "Sign up"}
            </Button>
          </div>

          <div className="flex justify-center gap-3 font-helvetica text-sm">
            Already have an account?
            <NavLink to="/log-in" className="hover:text-turquoise">
              Log in
            </NavLink>
          </div>
        </form>
      </div>

      <div className="hidden lg:block">
        <div className="h-screen w-full">
          <img
            src={signupImg}
            alt="Image"
            className="h-full w-full object-cover object-bottom"
          />
        </div>
      </div>

      <div className="absolute left-7 top-5">
        <NavLink to="/">
          <h1 className="font-superglue text-2xl tracking-widest text-turquoise">
            ChilLChilL
          </h1>
        </NavLink>
      </div>
    </div>
  );
};

export default Signup;
