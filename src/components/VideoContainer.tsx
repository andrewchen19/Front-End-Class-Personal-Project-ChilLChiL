import React, { useRef } from "react";
import surfVideo from "../assets/videos/surf-video.mp4";
import poster from "../assets/images/poster.png";

const VideoContainer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0.042;
    }
  };

  return (
    <video
      loop
      autoPlay
      muted
      preload="auto"
      poster={poster}
      onLoadedMetadata={handleLoadedMetadata}
    >
      <source src={surfVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoContainer;
