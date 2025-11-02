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
  const isGoogleDrive = (src) => /drive\.google\.com\/file\/d\//i.test(src || "");

  const ytId = (src) => {
    if (!src) return "";
    const m = src.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/) || [];
    return m[1] || "";
  };

  const [overlayScale, setOverlayScale] = useState(1);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  // 📏 Overlay scaling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const maxScroll = windowHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      const scale = 1 + progress * 4;
      setOverlayScale(scale);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ▶️ Toggle play/pause
  const handleToggleVideo = () => {
    const vid = videoRef.current;
    if (vid) {
      if (vid.paused) {
        vid.play();
        setPlaying(true);
      } else {
        vid.pause();
        setPlaying(false);
      }
    }
  };

  // 🔇 Toggle mute
  const handleMuteToggle = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = !vid.muted;
      setMuted(vid.muted);
    }
  };

  // 🔁 Restart
  const handleRestart = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play();
      setPlaying(true);
    }
  };

  // 🖥️ Fullscreen toggle
  const handleFullscreen = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (!document.fullscreenElement) {
      vid.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="art-page dome-scroll">
      {/* --- brand --- */}
      <button className="brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      {/* --- menu --- */}
      <div className="menu">
        <MenuOverlay />
      </div>

      {/* --- video section --- */}
      <div className="video-section">
        {isVideoFile(pickSrc) ? (
          <video
            ref={videoRef}
            className="masked-video"
            src={pickSrc}
            autoPlay
            loop
            muted={muted}
            playsInline
            controls={false}
          />
        ) : isYouTube(pickSrc) ? (
          <iframe
            className="masked-video"
            src={`https://www.youtube.com/embed/${ytId(
              pickSrc
            )}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&playlist=${ytId(
              pickSrc
            )}`}
            title={title || "YouTube video"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
        ) : isGoogleDrive(pickSrc) ? (
          <iframe
            className="masked-video"
            src={pickSrc.replace("/view", "/preview")}
            allow="autoplay"
            allowFullScreen
            frameBorder="0"
            title={title || "Google Drive video"}
          />
        ) : (
          <img src={pickSrc} alt={title || "artwork"} className="masked-video" />
        )}

        {/* Expanding overlay */}
        <img
          src="/assets/bg.png"
          alt="Overlay"
          className="video-overlay"
          style={{ transform: `translate(-50%, -50%) scale(${overlayScale})` }}
        />
      </div>

      {/* ✅ Control panel below video */}
      {isVideoFile(pickSrc) && (
        <div className="video-controls-below">
          <button onClick={handleToggleVideo}>
            {playing ? "Pause" : "Play"}
          </button>
          <button onClick={handleMuteToggle}>
            {muted ? "Unmute" : "Mute"}
          </button>
          <button onClick={handleRestart}>Restart</button>
          <button onClick={handleFullscreen}>
            {isFullscreen ? "Fullscreen" : "Fullscreen"}
          </button>
        </div>
      )}

      {/* --- text metadata --- */}
      <div className="bottom-left">
        <div>{title}</div>
        <div>{date}</div>
      </div>

      <div className="bottom-right">
        <div>{artistName}</div>
        <div>{projectName}</div>
      </div>

      <div className="description-section">{description}</div>
    </div>
  );
}
