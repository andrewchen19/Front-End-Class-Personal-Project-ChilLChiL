import React from "react";
import surfVideo from "../assets/videos/202405131712.mp4";
import poster from "../assets/images/poster.png";

const VideoContainer: React.FC = () => {
  return (
    <video
      loop
      autoPlay
      muted
      preload="auto"
      poster={poster}
      className="h-full w-full object-cover object-center"
    >
      <source src={surfVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoContainer;
