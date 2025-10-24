import "./videopages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

  return (
    <div className={`art-page ${isExpanded ? "expanded" : ""}`}>
      <button className="brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="menu"> <MenuOverlay /> </div>

      <div
        className={`oval-wrapper ${isExpanded ? "oval-expanded" : ""}`}
        onClick={() => setExpanded(!isExpanded)}
      >
        {isVideoFile(pickSrc) ? (
          <video
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
            src={`https://www.youtube.com/embed/${ytId(pickSrc)}?autoplay=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&playlist=${ytId(
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
