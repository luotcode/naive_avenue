import "./videopages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MenuOverlay from "../components/menuoverlay";

export default function VideoPages({
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
  const maskTriggerRef = useRef(null);
  const videoRef = useRef(null);
  const prevTopRef = useRef(null);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!maskTriggerRef.current) return;
      const rect = maskTriggerRef.current.getBoundingClientRect();
      const currentTop = rect.top;
      const prevTop =
        prevTopRef.current !== null ? prevTopRef.current : currentTop;
      const justReachedTop = prevTop > 0 && currentTop <= 0;
      if (justReachedTop && !isUnmasked) {
        setUnmasked(true);
        el.scrollTop = el.scrollTop + currentTop;
      }
      prevTopRef.current = currentTop;
    };

    el.addEventListener("scroll", handleScroll, { passive: false });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isUnmasked]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isUnmasked) {
        setUnmasked(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
      className={`art-page ${isUnmasked ? "unmasked" : ""}`}
    >
      <button className="brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="menu">
        <MenuOverlay />
      </div>

      <div
        ref={maskTriggerRef}
        className={`video-mask-wrapper ${isUnmasked ? "video-mask-open" : ""}`}
        onClick={handleToggleVideo}
      >
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
            )}?autoplay=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&playlist=${ytId(
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
    </div>
  );
}
