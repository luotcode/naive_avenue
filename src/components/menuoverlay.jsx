import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./menuoverlay.css";

export default function MenuOverlay() {
  const nav = useNavigate();
  const location = useLocation();
  const [gif, setGif] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const gifs = [
      "/assets/monster-icon-1.gif",
      "/assets/monster-icon-2.gif",
      "/assets/monster-icon-3.gif",
      "/assets/monster-icon-4.gif",
    ];
    const randomIndex = Math.floor(Math.random() * gifs.length);
    setGif(gifs[randomIndex]);
  }, []);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path) => {
    nav(path);
    setMenuOpen(false);
  };

  return (
    <div className="menu-wrap">
      <button
        className="menu-btn"
        onClick={handleMenuClick}
      >
        MENU
      </button>

      {menuOpen && (
        <div className="menu-dropdown">
          <button className="menu-dropdown-item" onClick={() => handleNavigation("/about")}>
            ABOUT
          </button>
          <button className="menu-dropdown-item" onClick={() => handleNavigation("/directory")}>
            DIRECTORY
          </button>
        </div>
      )}

      {gif && (
        <div
          className="menu-gif"
          title="BOO! IT'S RICARDO."
          onClick={() => nav("/ricardo-bodini")}
        >
          <img src={gif} alt="Random monster icon" />
        </div>
      )}
    </div>
  );
}
