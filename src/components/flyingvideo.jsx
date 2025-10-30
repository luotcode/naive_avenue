import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./flyingvideo.css";

export default function FlyingVideo({ src, size = 120, frequency = 15000 }) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const randomOffScreenPosition = () => {
      // 4 sides: top, bottom, left, right
      const side = Math.floor(Math.random() * 4);
      switch (side) {
        case 0: // left
          return { x: -20, y: Math.random() * 100 };
        case 1: // right
          return { x: 120, y: Math.random() * 100 };
        case 2: // top
          return { x: Math.random() * 100, y: -20 };
        case 3: // bottom
          return { x: Math.random() * 100, y: 120 };
        default:
          return { x: -20, y: 50 };
      }
    };

    const showOnce = () => {
      const start = randomOffScreenPosition();
      const end = randomOffScreenPosition();
      const mid = {
        x: Math.random() * 60 + 20, // ensure middle of screen
        y: Math.random() * 60 + 20,
      };

      const startRotate = Math.random() * 20 - 10;
      const endRotate = Math.random() * 20 - 10;
      const duration = Math.random() * 10 + 12; // 12–22s total

      setStyle({
        "--start-x": `${start.x}vw`,
        "--start-y": `${start.y}vh`,
        "--mid-x": `${mid.x}vw`,
        "--mid-y": `${mid.y}vh`,
        "--end-x": `${end.x}vw`,
        "--end-y": `${end.y}vh`,
        "--start-rotate": `${startRotate}deg`,
        "--end-rotate": `${endRotate}deg`,
        "--anim-duration": `${duration}s`,
      });

      setVisible(true);

      timeout = setTimeout(() => {
        setVisible(false);
        timeout = setTimeout(showOnce, frequency);
      }, duration * 1000 + 1000);
    };

    showOnce();
    return () => clearTimeout(timeout);
  }, [frequency]);

  const handleClick = () => {
    navigate("/nicola-bertoglio");
  };

  return (
    <div className={`flying-video ${visible ? "show" : ""}`}
      style={style}
      onClick={handleClick}>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: `${size}px`, height: "auto" }}
      />
    </div>

  );
}
