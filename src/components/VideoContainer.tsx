import React from "react";
import surfVideo from "../assets/videos/surf-video-reduce.mp4";

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
