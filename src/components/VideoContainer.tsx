import React from "react";
import surfVideo from "../assets/videos/3125821-uhd_3840_2160_24fps.mp4";

const VideoContainer: React.FC = () => {
  return (
    <video
      loop
      autoPlay
      muted
      preload="auto"
      className="h-full w-full object-cover object-center"
    >
      <source src={surfVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoContainer;
