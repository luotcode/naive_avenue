import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";

import LandingPage from "./pages/LandingPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import MobilePage from "./pages/mobile.jsx";
import RedirectMobile from "./components/mobileredirect.jsx";

import EmilyPage from "./pages/artworkpages/EmilyPage.jsx";
import IvyPage from "./pages/artworkpages/IvyPage.jsx";
import LhpgPage from "./pages/artworkpages/LhpgPage.jsx";
import LeThanhThaoPage from "./pages/artworkpages/LeThanhThaoPage.jsx";
import NguyenHoangGiaBaoPage from "./pages/artworkpages/NguyenHoangGiaBaoPage.jsx";
import NguyenThaiBaoPage from "./pages/artworkpages/NguyenThaiBaoPage.jsx";
import HaThaoPage from "./pages/artworkpages/HaThaoPage.jsx";
import LuongCamAnhPage from "./pages/artworkpages/LuongCamAnhPage.jsx";
import ValentinSismannNightScapePage from "./pages/artworkpages/ValentinSismannNightScapePage.jsx";
import ValentinSismannPickleSongPage from "./pages/artworkpages/ValentinSismannPickleSongPage.jsx";
import DangKhangNinhPage from "./pages/artworkpages/DangKhangNinhPage.jsx";
import HanDaoDanOngPage from "./pages/artworkpages/HanDaoDanOngPage.jsx";
import HanDaoExoticPage from "./pages/artworkpages/HanDaoExoticPage.jsx";
import LyonNguyenPage from "./pages/artworkpages/LyonNguyenPage.jsx";
import NguyenHoangGiangPage from "./pages/artworkpages/NguyenHoangGiangPage.jsx";
import RicardoBodiniPage from "./pages/artworkpages/RicardoBodiniPage.jsx";
import NicolaBertoglioPage from "./pages/artworkpages/NicolaBertoglioPage.jsx";
import TaisKoshinoPage from "./pages/artworkpages/TaisKoshinoPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      /<RedirectMobile />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/nguyen-thai-bao" element={<NguyenThaiBaoPage />} />
        <Route path="/dang-khang-ninh" element={<DangKhangNinhPage />} />
        <Route path="/han-dao-dan-ong" element={<HanDaoDanOngPage />} />
        <Route path="/han-dao-you-are-so-exotic-looking" element={<HanDaoExoticPage />} />
        <Route path="/nguyen-hoang-giang" element={<NguyenHoangGiangPage />} />
        <Route path="/ricardo-bodini" element={<RicardoBodiniPage />} />
        <Route path="/nicola-bertoglio" element={<NicolaBertoglioPage />} />
        <Route path="/lyon-nguyen" element={<LyonNguyenPage />} />
        <Route path="/ha-thao" element={<HaThaoPage />} />
        <Route path="/luong-cam-anh" element={<LuongCamAnhPage />} />
        <Route path="/valentin-sismann-nightscape" element={<ValentinSismannNightScapePage />} />
        <Route path="/valentin-sismann-pickle-song" element={<ValentinSismannPickleSongPage />} />
        <Route path="/emily-sarten" element={<EmilyPage />} />
        <Route path="/ivy-vo" element={<IvyPage />} />
        <Route path="/lhpg" element={<LhpgPage />} />
        <Route path="/le-thanh-thao" element={<LeThanhThaoPage />} />
        <Route path="/nguyen-hoang-gia-bao" element={<NguyenHoangGiaBaoPage />} />
        <Route path="/tais-koshino" element={<TaisKoshinoPage />} />
        <Route path="/mobile" element={<MobilePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
