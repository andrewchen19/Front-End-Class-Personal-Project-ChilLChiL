import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function Velocity({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // This is a magic wrapping for the length of the text
  // you have to replace for wrapping that works for you or dynamically calculate
  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // This is what changes the direction of the scroll once we switch scrolling directions
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the child text should be dynamically calculated
   * based on the size of the text and viewport. Likewise, the x motion value is
   * currently wrapped between 0 and -25% - this 25% is derived from the fact
   * we have four children (100% / 4). This would also want deriving from the
   * dynamically generated number of children.
   */
  return (
    <div className="m-0 flex flex-nowrap overflow-x-hidden whitespace-nowrap leading-none tracking-tight">
      <motion.div
        className="font-veneer flex whitespace-nowrap text-6xl font-semibold uppercase tracking-wide text-white"
        style={{ x }}
      >
        <span
          className="mr-[30px] inline-block "
          style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
        >
          {children}
        </span>
        <span
          className="mr-[30px] inline-block"
          style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
        >
          {children}
        </span>
        <span
          className="mr-[30px] inline-block"
          style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
        >
          {children}
        </span>
        <span
          className="mr-[30px] inline-block"
          style={{ textShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)" }}
        >
          {children}
        </span>
      </motion.div>
    </div>
  );
}

export default Velocity;
