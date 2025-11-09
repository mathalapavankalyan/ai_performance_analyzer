import React, { useState, useEffect } from "react";
import "../styles/video.css";

export const VideoCarousel = () => {
  const videos = [
    "https://cdn-imgix.headout.com/media/videos/28ba62e83e1d932b253bea84cc37de7e-Cappadocia%20Hot%20Air%20Balloon_720P.mp4",
    "https://cdn-imgix.headout.com/media/videos/28ba62e83e1d932b253bea84cc37de7e-Cappadocia%20Hot%20Air%20Balloon_720P.mp4",
    "https://cdn-imgix.headout.com/media/videos/28ba62e83e1d932b253bea84cc37de7e-Cappadocia%20Hot%20Air%20Balloon_720P.mp4"
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [videos.length]);

  const nextVideo = () => setCurrent((current + 1) % videos.length);
  const prevVideo = () => setCurrent((current - 1 + videos.length) % videos.length);

  return (
    <div className="video-carousel-container">
      <div className="video-wrapper">
        <video
          key={current}
          src={videos[current]}
          autoPlay
          muted
          loop
          controls
          className="video-slide"
        ></video>
      </div>

      <button className="nav-btn left" onClick={prevVideo}>❮</button>
      <button className="nav-btn right" onClick={nextVideo}>❯</button>

      <div className="dots">
        {videos.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
