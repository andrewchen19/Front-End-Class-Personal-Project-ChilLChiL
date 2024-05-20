import React from "react";

const Loading: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[200] flex h-screen w-full items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 1)" }}
    >
      <div className="global-loader">
        <span>Loading</span>
        <span>Loading</span>
      </div>
    </div>
  );
};

export default Loading;
