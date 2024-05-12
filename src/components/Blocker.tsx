import React, { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCover } from "../features/article/articleSlice";

// react icons
import { AiOutlineWarning } from "react-icons/ai";

// framer motion
import { motion, Variants } from "framer-motion";
const centerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

// shadcn
import { Button } from "@/components/ui/button";

interface BlockerProps {
  isEdited: boolean;
}

const Blocker: React.FC<BlockerProps> = ({ isEdited }) => {
  const dispatch = useDispatch();

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEdited && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (blocker.state === "blocked") {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    // Ensure scrolling is re-enabled when component unmounts
    return () => {
      body.style.overflow = "auto";
    };
  }, [blocker.state]);

  return (
    <>
      {blocker.state === "blocked" ? (
        <div
          className="fixed inset-0 flex h-full w-full items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={centerVariant}
            className="flex w-[365px] flex-col rounded-xl bg-white p-5"
            style={{ boxShadow: "rgba(6, 2, 2, 0.15) 0px 2px 10px" }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="grid h-8 w-8 animate-bounce place-items-center rounded-full bg-pink-light">
                <AiOutlineWarning className="text-xl text-carrot" />
              </div>

              <div className="-mt-1 flex flex-col gap-1 text-center font-helvetica text-sm text-gray-700">
                <p>Changes you made may not be saved.</p>
                <p>Are you sure you want to leave?</p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={"turquoise-hipster"}
                  size={"sm"}
                  onClick={() => blocker.reset()}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant={"pink-hipster"}
                  size={"sm"}
                  onClick={() => {
                    dispatch(resetCover());
                    blocker.proceed();
                  }}
                >
                  Leave
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </>
  );
};

export default Blocker;
