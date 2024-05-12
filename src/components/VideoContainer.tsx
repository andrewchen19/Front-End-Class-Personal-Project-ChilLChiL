import React from "react";
import surfVideo from "../assets/videos/3125821-uhd_3840_2160_24fps.mp4";
import poster from "../assets/images/poster.png";

const VideoContainer: React.FC = () => {
  return (
    <video loop autoPlay muted preload="auto" poster={poster}>
      <source src={surfVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoContainer;
