import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="grid h-14 place-items-center items-center bg-black text-white">
      <p className="flex gap-3 font-helvetica text-xs">
        Copyright &copy; {new Date().getFullYear()}
        <span className="text-turquoise">Andrew Chen</span> All right reserved.
      </p>
    </footer>
  );
};

export default Footer;
