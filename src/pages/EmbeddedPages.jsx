import "./embeddedpages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import MenuOverlay from "../components/menuoverlay";

export default function EmbeddedPages({
  imageSrc,
  videoSrc,
  mediaSrc,
  title,
  date,
  artistName,
  projectName,
  description,
  frameSize = "large",
}) {
  const navigate = useNavigate();
  const pickSrc = imageSrc || videoSrc || mediaSrc || "";

  const isVideoFile = (s) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(s || "");
  const isYouTube = (s) => /(youtube\.com|youtu\.be)/i.test(s || "");
  const ytId = (s) => (s?.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/) || [])[1] || "";
  const isHttpUrl = (s) => /^https?:\/\//i.test(s || "");

  return (
    <div className="sk-page">
      <button className="sk-brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="sk-menu">
        <MenuOverlay />
      </div>

      <div className="sk-stage">
        <div className={`sk-mediaFrame ${frameSize === "small" ? "is-small" : ""}`}>
          {isVideoFile(pickSrc) ? (
            <video
              className="sk-media"
              src={pickSrc}
              autoPlay
              loop
              playsInline
              controls={false}
            />
          ) : isYouTube(pickSrc) ? (
            <iframe
              className="sk-media"
              src={`https://www.youtube.com/embed/${ytId(pickSrc)}?autoplay=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&playlist=${ytId(
                pickSrc
              )}`}
              title={title || "video"}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          ) : isHttpUrl(pickSrc) ? (
            <div className="web-wrapper">
              <iframe
                src={pickSrc}
                title={title || "embedded website"}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            !!pickSrc && <img className="sk-media" src={pickSrc} alt={title || "artwork"} />
          )}
        </div>
      </div>

      <div className="sk-bl">
        <div>{title}</div>
        <div>{date}</div>
      </div>

      <div className="sk-br">
        <div>{artistName}</div>
        <div>{projectName}</div>
      </div>

      <div className="sk-desc">{description}</div>
    </div>
  );
}
