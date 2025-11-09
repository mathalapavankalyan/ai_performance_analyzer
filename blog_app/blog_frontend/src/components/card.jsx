import React, { useState } from "react";
import "../styles/card.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { likeBlog } from "../api/content_api";

export const Card = ({id, data , onLikeChange }) => {
  const { image_url, topic, author, likes: initialLikes, date_of_upload , content } = data || {};

  const [liked , setLiked] = useState(false);
  const [likes , setLikes] =  useState(initialLikes || 0);
  const [isLiking , setIsLiking] = useState(false);

   const toggleLike = async() => {

    if(isLiking) return;
    setIsLiking(true);
    const newLiked = !liked;
    const newLikes  = newLiked ? likes+1 : likes - 1;
    setLiked(newLiked);
    setLikes(newLikes);

    onLikeChange?.(id , newLiked);

    try{
      await likeBlog(id, newLiked);
    }

    catch(error){
      console.log("Error updating like:" , error);
      setLiked(liked);
      setLikes(likes);
    }
    finally{
      setIsLiking(false);
    }
  };

  return (

      <div className="card-content">
         <div className="card-image-container"><img  src={image_url} alt = "image not found"></img></div>
       
        <div className="card-box"> <h3 className="card-title">{topic || "Untitled Blog"}</h3>
        <p>{content || "content not found"}</p>
        <div className="likes-row">
          
          <span className="heart-icon" onClick={toggleLike}>
            {liked ? <FaHeart color="red" size={20}/>: <FaRegHeart size={20} />}
          </span>
          <p className="card-likes">{likes} Likes</p>
        </div>
        <p className="card-date">
          posted on : {date_of_upload ? new Date(date_of_upload).toLocaleDateString() : ""}
        </p>
        <p className="card-author">{author || "Unknown Author"}</p>
        </div>
      </div>
  );
};
