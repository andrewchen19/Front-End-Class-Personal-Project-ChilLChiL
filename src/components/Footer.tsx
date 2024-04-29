import React from "react";
import { Link } from "react-router-dom";

// overflow-x-hidden

const Footer: React.FC = () => {
  return (
    <footer className="relative grid h-14 place-items-center items-center overflow-x-clip whitespace-nowrap border-t-[3px] border-pink bg-black text-white">
      {/* animation */}
      <div className="animate-marquee absolute -top-[30px] left-0 right-0 z-10">
        <div className="h-7 w-5">
          <Link to="/">
            <img
              src="https://akstatic.streetvoice.com/asset/images/sv-cat.gif"
              alt="cat-icon"
              className="h-full w-full"
            />
          </Link>
        </div>
      </div>

      <p className="flex gap-3 text-xs font-medium tracking-wide">
        Copyright &copy; {new Date().getFullYear()}
        <span className=" text-turquoise">Andrew Chen</span> All right reserved.
      </p>
    </footer>
  );
};

export default Footer;
