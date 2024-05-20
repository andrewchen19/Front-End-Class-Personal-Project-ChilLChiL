import React from "react";
import surfVideo from "../assets/videos/surf-video-reduce.mp4";
import posterImg from "../assets/images/poster.png";

const VideoContainer: React.FC = () => {
  return (
    <video
      loop
      autoPlay
      muted
      preload="auto"
      poster={posterImg}
      className="h-full w-full object-cover object-center"
    >
      <source src={surfVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoContainer;
