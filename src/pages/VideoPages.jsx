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

  const [isExpanded, setExpanded] = useState(false);
  const pageRef = useRef(null);
  const ovalRef = useRef(null);
  const videoRef = useRef(null);

  const prevOvalTop = useRef(null);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!ovalRef.current) return;

      const rect = ovalRef.current.getBoundingClientRect();
      const currentTop = rect.top;         
      const prevTop =
        prevOvalTop.current !== null ? prevOvalTop.current : currentTop;

      const justReachedTop = prevTop > 0 && currentTop <= 0;

      // console.log({ prevTop, currentTop, justReachedTop, isExpanded });

      if (justReachedTop && !isExpanded) {
        // expand
        setExpanded(true);

        el.scrollTop = el.scrollTop + currentTop;
      }

      prevOvalTop.current = currentTop;
    };

    el.addEventListener("scroll", handleScroll, { passive: false });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isExpanded) {
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  const handleToggleVideo = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) video.play();
      else video.pause();
    }
  };

  return (
    <div
      ref={pageRef}
      className={`art-page ${isExpanded ? "expanded" : ""}`}
    >
      <button className="brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="menu">
        <MenuOverlay />
      </div>

      <div
        ref={ovalRef}
        className={`oval-wrapper ${isExpanded ? "oval-expanded" : ""}`}
        onClick={handleToggleVideo}
      >
        {isVideoFile(pickSrc) ? (
          <video
            ref={videoRef}
            className="oval-image"
            src={pickSrc}
            autoPlay
            loop
            playsInline
            controls={false}
          />
        ) : isYouTube(pickSrc) ? (
          <iframe
            className="oval-image"
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
          <img src={pickSrc} alt={title || "artwork"} className="oval-image" />
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
