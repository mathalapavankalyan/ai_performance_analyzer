import React from "react";
import { VideoCarousel } from "../components/video.jsx";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import {PerformanceBot} from "../components/performanceBot.jsx"

export const Home = () => {
  const navigate = useNavigate()

  const handleNavigate = ()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
    return navigate("/blogs")
  }
  return (
    <div className="home-container">
    

      {/* Video Carousel */}
      <section className="carousel-section">
        <h2 className="section-title">Discover the Beauty of the World</h2>
        <VideoCarousel />
      </section>

        <section className="hero-section">
        <h1 className="hero-title"> Explore the World Through Stories</h1>
        <p className="hero-subtitle">
          Welcome to <strong>WanderWords</strong> — a vibrant space where travel enthusiasts share their experiences, 
          breathtaking destinations, and travel tips. Discover beautiful places, inspiring journeys, and 
          hidden gems from every corner of the world. 🌍
        </p>
      </section>


      {/* About Section */}
      <section className="about-section">
        <h2>About Our Blog App</h2>
        <p>
          This platform is more than just a blog — it’s a collection of adventures.  
          Our community of travelers and storytellers share real experiences to inspire your next trip.  
          Browse captivating blogs about exotic destinations, practical travel tips, and cultural discoveries.
        </p>
        <p>
          Whether you’re looking for the best cafés in Lisbon, hidden trails in New Zealand,  
          or the perfect weekend escape, you’ll find authentic insights written by passionate explorers.
        </p>
        <p>
          You can also create your own travel blog, upload stunning images, and connect with 
          like-minded travelers across the globe. 🌎
        </p>
      </section>

      <section className="cta-section">
        <h3>Start Your Journey Today </h3>
        <p>
          Explore blogs, share your adventures, and inspire others.  
          Let’s make the world a smaller, more connected place — one story at a time.
        </p>
        <button className="cta-button" onClick={handleNavigate}>Read Blogs</button>
      </section>

      <PerformanceBot />
    </div>
  );
};
