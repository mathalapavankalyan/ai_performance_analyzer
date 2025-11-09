import React, { useState ,useEffect } from "react";
import "../styles/content.css";
import {getAllBlogs} from  "../api/content_api.jsx"
import {Card} from "./card.jsx"
export const Content = () => {
  const text = "Welcome to WanderWords";
  const [data , setData] = useState([])
    useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllBlogs(); 
        setData(result); 
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []);


  const handleLikeChange = (id, newLiked) =>{
         setData((prev) => 
        prev?.map((b) =>
        b.id === id ?
        {...b, likes:b.likes + (newLiked?1 : -1)} : b))
  }
  return (
    <div className="content-container">
      <h3 className="reveal-text">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="char"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h3>
      <h4>Find your finest blogs here...</h4>
      <div className="cards-container">
  {data?.map((blog, i) => (
    <Card key={i} id ={blog._id} data={blog} onLikeChange = {handleLikeChange} />
  ))}
</div>

    </div>
  );
};
