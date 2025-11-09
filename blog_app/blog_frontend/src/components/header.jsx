import React from "react";
import "../styles/header.css";
import { NavLink } from "react-router-dom";
import { Searchbar } from "./Searchbar.jsx";
import { log } from "../utils/logger.jsx";

export const Header = () => {
  const handleNavigation = (destination) => {
    log("INFO", `User clicked navigation link: ${destination}`);
  };

  return (
    <div className="header-container">
      <div><Searchbar /></div>

      <NavLink to="/" className="item" onClick={() => handleNavigation("Home")}>Home</NavLink>
      <NavLink to="/blogs" className="item" onClick={() => handleNavigation("Blogs")}>Blogs</NavLink>
      <NavLink to="/favourites" className="item" onClick={() => handleNavigation("Favourites")}>Favourite Blogs</NavLink>
      <NavLink to="/contact" className="item" onClick={() => handleNavigation("Contact")}>Contact</NavLink>
      <NavLink to="/profile" className="item" onClick={() => handleNavigation("Profile")}>Profile</NavLink>
    </div>
  );
};
