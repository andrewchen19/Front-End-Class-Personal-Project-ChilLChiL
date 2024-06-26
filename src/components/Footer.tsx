import React from "react";

// border-t-[3px] border-pink
//

const Footer: React.FC = () => {
  return (
    <footer className="relative grid h-14 place-items-center items-center overflow-x-clip whitespace-nowrap bg-gray-950 text-white">
      {/* animation */}
      {/* -top-[50px] */}
      <div className="absolute -top-[28px] left-0 right-0 z-[100] animate-marquee">
        <div className="h-7 w-5">
          <a href="/">
            <img
              src="https://akstatic.streetvoice.com/asset/images/sv-cat.gif"
              alt="cat-icon"
              className="h-full w-full"
            />
          </a>
        </div>

        {/* <div className="h-16 w-16">
          <iframe
            src="https://giphy.com/embed/6fe3FqaajDFeHdfG1V"
            className="h-full w-full bg-transparent"
            sandbox="allow-same-origin allow-scripts"
          ></iframe>
        </div> */}
      </div>

      <p className="flex gap-3 text-xs font-medium tracking-wide">
        Copyright &copy; {new Date().getFullYear()}
        <span className=" text-turquoise">Andrew Chen</span> All right reserved.
      </p>
    </footer>
  );
};

export default Footer;
