import "./embeddedpages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import MenuOverlay from "../components/menuoverlay";

export default function EmbeddedPages({
  mediaList = [],
  title,
  date,
  artistName,
  projectName,
  description,
  frameSize = "large",
}) {
  const navigate = useNavigate();

  const isVideoFile = (s) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(s || "");
  const isYouTube = (s) => /(youtube\.com|youtu\.be)/i.test(s || "") && !/videoseries|list=/i.test(s || "");
  const ytId = (s) => (s?.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/) || [])[1] || "";
  const isYouTubePlaylist = (s) => /(youtube\.com.*videoseries|list=)/i.test(s || "");
  const isHttpUrl = (s) => /^https?:\/\//i.test(s || "");

  return (
    <div className="sk-page">
      <button className="sk-brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="sk-menu">
        <MenuOverlay />
      </div>

      <div className="sk-stage"
        style={{ height: `${mediaList.length * 100}vh` }}
      >
        {mediaList.map((src, i) => (
          <div
            key={i}
            className={`sk-mediaFrame ${frameSize === "small" ? "is-small" : ""}`}
          >
            {isVideoFile(src) ? (
              <video
                className="sk-media"
                src={src}
                autoPlay
                loop
                playsInline
                controls={false}
              />
            ) : isYouTube(src) ? (
              <iframe
                className="sk-media"
                src={`https://www.youtube.com/embed/${ytId(src)}?autoplay=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&playlist=${ytId(src)}`}
                title={`${title || "video"}-${i}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            ) : isYouTubePlaylist(src) ? (
              <iframe
                className="sk-media"
                src={`${src}&rel=0`}
                title={`${title || "playlist"}-${i}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            )

              : isHttpUrl(src) ? (
                <div className="web-wrapper">
                  <iframe
                    src={src}
                    title={`${title || "embedded website"}-${i}`}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                !!src && (
                  <img
                    className="sk-media"
                    src={src}
                    alt={`${title || "artwork"}-${i}`}
                  />
                )
              )}
          </div>
        ))}
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
