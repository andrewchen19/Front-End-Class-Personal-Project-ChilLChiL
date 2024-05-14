import React, { FormEvent, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import loginImg from "../assets/images/login.jpg";

// firebase
import { db } from "../main";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { FirebaseError } from "@firebase/util";

// shadcn
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function getUserFromFirebase(id: string): Promise<void> {
    const q = query(collection(db, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      dispatch(setUser(user));
      toast.success("Log in Successfully 😎");
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    }
  }

  const submitHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please Provide All Values 😬");
      return;
    }

    setIsLoading(true);

    // sign in with firebase authentication
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Signed in
      const user = userCredential.user;

      if (user) {
        const id = user.uid;
        await getUserFromFirebase(id);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;

        if (!errorCode) return;

        if (errorCode.includes("invalid-credential")) {
          toast.error("Invalid Credential 😵");
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full border lg:grid lg:grid-cols-2 ">
      <div className="relative flex items-center justify-center py-12">
        <form
          className="mx-auto grid w-[400px] gap-6"
          onSubmit={(e) => submitHandler(e)}
        >
          <div className="grid gap-4 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Enter your email below to start the journey
            </p>
          </div>

          <div className="grid gap-7">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="chilL@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="user-email"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              size={"xl"}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : null}
              {isLoading ? "Loading" : "Login"}
            </Button>
          </div>

          <div className="flex justify-center gap-3 font-helvetica text-sm">
            Don&apos;t have an account?
            <NavLink to="/sign-up" className="hover:text-turquoise">
              Sign up
            </NavLink>
          </div>
        </form>

        <div className="absolute left-7 top-5">
          <NavLink to="/">
            <h1 className="font-superglue text-2xl tracking-widest text-turquoise">
              ChilLChilL
            </h1>
          </NavLink>
        </div>
      </div>
      <div className="hidden  lg:block">
        <div className="h-screen w-full">
          <img
            src={loginImg}
            alt="Image"
            className="h-full w-full object-cover object-bottom"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
