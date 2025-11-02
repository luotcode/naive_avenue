import "./domepages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MenuOverlay from "../components/menuoverlay";

export default function DomePages({
  imageSrc,
  videoSrc,
  mediaSrc,
  title,
  date,
  artistName,
  projectName,
  description,
}) {
  const navigate = useNavigate();
  const pickSrc = imageSrc || videoSrc || mediaSrc;

  const isVideoFile = (src) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(src || "");
  const isYouTube = (src) => /(youtube\.com|youtu\.be)/i.test(src || "");
  const ytId = (src) => {
    if (!src) return "";
    const m = src.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/) || [];
    return m[1] || "";
  };

  const [isUnmasked, setUnmasked] = useState(false);
  const pageRef = useRef(null);
  const videoRef = useRef(null);
  const [overlayScale, setOverlayScale] = useState(1);

  // 📏 Handle scroll zoom for overlay
  useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const maxScroll = windowHeight; // one viewport worth
    const progress = Math.min(scrollY / maxScroll, 1);

    // Start small (hole barely visible), end at ~2.6x for full reveal
    const scale = 1 + progress * 2; 
    setOverlayScale(scale);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  // ⎋ Escape to unmask
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isUnmasked) {
        setUnmasked(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUnmasked]);

  // 🕹️ ESC hint
  const [showEscHint, setShowEscHint] = useState(false);
  useEffect(() => {
    let t = null;
    if (isUnmasked) {
      setShowEscHint(true);
      t = setTimeout(() => setShowEscHint(false), 2000);
    } else {
      setShowEscHint(false);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isUnmasked]);

  const handleToggleVideo = () => {
    const vid = videoRef.current;
    if (vid) {
      if (vid.paused) vid.play();
      else vid.pause();
    }
  };

  return (
    <div
      ref={pageRef}
      className={`art-page dome-scroll ${isUnmasked ? "unmasked" : ""}`}
    >
      <button className="brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="menu">
        <MenuOverlay />
      </div>

      <div className="buffer">

      </div>

      <div className="video-section" onClick={handleToggleVideo}>
        {isVideoFile(pickSrc) ? (
          <video
            ref={videoRef}
            className="masked-video"
            src={pickSrc}
            autoPlay
            loop
            playsInline
            controls={false}
          />
        ) : isYouTube(pickSrc) ? (
          <iframe
            className="masked-video"
            src={`https://www.youtube.com/embed/${ytId(
              pickSrc
            )}?autoplay=1&loop=1&controls=1&playsinline=1&modestbranding=1&rel=0&playlist=${ytId(
              pickSrc
            )}`}
            title={title || "video"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
        ) : (
          <img src={pickSrc} alt={title || "artwork"} className="masked-video" />
        )}

        {/* ✅ Static overlay that scales with scroll */}
        <img
          src="/assets/bg.png"
          alt="Overlay"
          className="video-overlay"
          style={{ transform: `translate(-50%, -50%) scale(${overlayScale})` }}
        />
      </div>

      <div className="bottom-left">
        <div>{title}</div>
        <div>{date}</div>
      </div>

      <div className="bottom-right">
        <div>{artistName}</div>
        <div>{projectName}</div>
      </div>

      <div className="description-section">{description}</div>

      {isUnmasked && (
        <div
          className={`esc-hint ${showEscHint ? "show" : ""}`}
          role="status"
          aria-live="polite"
        >
          Press [ Esc ] to exit expanded view.
        </div>
      )}
    </div>
  );
}
