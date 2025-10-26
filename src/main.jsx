import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

import EmilyPage from "./pages/artworkpages/EmilyPage.jsx";
import IvyPage from "./pages/artworkpages/IvyPage.jsx";
import LhpgPage from "./pages/artworkpages/LhpgPage.jsx";
import ThanhThaoPage from "./pages/artworkpages/ThanhThaoPage.jsx";
import NguyenHoangGiaBaoPage from "./pages/artworkpages/NguyenHoangGiaBaoPage.jsx";

import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/emily-sarten" element={<EmilyPage />} />
        <Route path="/ivy-vo" element={<IvyPage />} />
        <Route path="/lhpg" element={<LhpgPage />} />
        <Route path="/le-thanh-thao" element={<ThanhThaoPage />} />
        <Route path="/NguyenHoangGiaBao" element={<NguyenHoangGiaBaoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
