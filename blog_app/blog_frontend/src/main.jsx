import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/header.jsx";
import { Content } from "./components/content.jsx";
import {Home} from "./pages/home.jsx"
import { Favourites } from "./pages/favourites.jsx";
import { Contact } from "./pages/contact.jsx";
import { Profile } from "./pages/profile.jsx";
import { RouteLogger } from "./components/RouteLogger.jsx";
import {PerformanceBot} from "./components/performanceBot.jsx"


const App = () => {
  return (
    <BrowserRouter>
      <div className="main-container">
        <Header />
        <RouteLogger/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Content />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <PerformanceBot/>
      </div>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
