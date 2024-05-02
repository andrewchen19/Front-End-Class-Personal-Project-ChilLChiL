import React from "react";
import { useBlocker } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCover } from "../features/article/articleSlice";

// react icons
import { AiOutlineWarning } from "react-icons/ai";

// framer motion
import { motion, Variants } from "framer-motion";

interface BlockerProps {
  isEdited: boolean;
}

const centerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.5 } },
};

const Blocker: React.FC<BlockerProps> = ({ isEdited }) => {
  const dispatch = useDispatch();

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEdited && currentLocation.pathname !== nextLocation.pathname,
  );

  return (
    <>
      {blocker.state === "blocked" ? (
        <div
          className="fixed inset-0 flex h-full w-full justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={centerVariant}
            viewport={{ once: true }}
            className="mt-20 flex h-[165px] w-[365px] flex-col rounded-xl bg-white p-5"
            style={{ boxShadow: "rgba(6, 2, 2, 0.15) 0px 2px 10px" }}
          >
            <div className="flex justify-center">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-pink-light">
                <AiOutlineWarning className="-mt-[2px] text-lg text-carrot" />
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-1 text-center font-helvetica text-sm text-gray-500">
              <p>Changes you made may not be saved.</p>
              <p>Are you sure you want to leave?</p>
            </div>

            <div className="mx-auto mt-auto flex gap-4">
              <button
                type="button"
                className="btn-turquoise"
                onClick={() => blocker.reset()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-pink"
                onClick={() => {
                  dispatch(resetCover());
                  blocker.proceed();
                }}
              >
                Leave
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </>
  );
};

export default Blocker;
