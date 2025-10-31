import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./flyingvideo.css";

export default function FlyingVideo({ src, size = 120, frequency = 15000, alwaysOnTop = false }) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({});
  const navigate = useNavigate();
  const shadowTooltipRef = useRef(null);
  const customTooltipRef = useRef(null);

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

  const createCustomTooltip = (text) => {
    try {
      if (customTooltipRef.current) return customTooltipRef.current;
      const t = document.createElement("div");
      t.className = "flying-custom-tooltip";
      t.style.position = "fixed";
      t.style.pointerEvents = "none";
      t.style.padding = "6px 8px";
      t.style.background = "rgba(0,0,0,0.85)";
      t.style.color = "#f7fcc5";
      t.style.borderRadius = "4px";
      t.style.fontSize = "13px";
      t.style.fontFamily = "Schroffer Mono, monospace";
      t.style.zIndex = alwaysOnTop ? "2147483648" : "10050";
      t.style.opacity = "0";
      t.style.transition = "opacity 0.08s ease, transform 0.08s ease";
      t.style.whiteSpace = "nowrap";
      t.textContent = text;
      document.body.appendChild(t);
      void t.offsetWidth;
      t.style.opacity = "1";
      customTooltipRef.current = t;
      return t;
    } catch (err) {
      return null;
    }
  };

  const removeCustomTooltip = () => {
    try {
      if (customTooltipRef.current && customTooltipRef.current.parentNode) {
        customTooltipRef.current.parentNode.removeChild(customTooltipRef.current);
      }
    } catch (err) {}
    customTooltipRef.current = null;
  };

  const handleMouseEnter = (e) => {
    try {
      // hide shadow's tooltip if present
      const s = document.querySelector('.shadow-tooltip');
      if (s) {
        shadowTooltipRef.current = s;
        try { s.style.display = 'none'; } catch (err) {}
      }
      createCustomTooltip('The AI Dance with us - Nicola Bertoglio');
      handleMouseMove(e);
    } catch (err) {}
  };

  const handleMouseMove = (e) => {
    try {
      const t = customTooltipRef.current;
      if (!t) return;
      const pad = 12;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const tw = t.getBoundingClientRect().width;
      const th = t.getBoundingClientRect().height;
      let tx = e.clientX + pad;
      let ty = e.clientY + pad;
      if (tx + tw + 8 > vw) tx = e.clientX - tw - pad;
      if (ty + th + 8 > vh) ty = e.clientY - th - pad;
      t.style.left = tx + 'px';
      t.style.top = ty + 'px';
    } catch (err) {}
  };

  const handleMouseLeave = () => {
    try {
      removeCustomTooltip();
      if (shadowTooltipRef.current) {
        try { shadowTooltipRef.current.style.display = ''; } catch (err) {}
        shadowTooltipRef.current = null;
      }
    } catch (err) {}
  };

  useEffect(() => {
    return () => {
      try {
        removeCustomTooltip();

        try {
          if (shadowTooltipRef.current && shadowTooltipRef.current.parentNode) {
            shadowTooltipRef.current.parentNode.removeChild(shadowTooltipRef.current);
          }
        } catch (e) {}
        shadowTooltipRef.current = null;

        try {
          const s = document.querySelector('.shadow-tooltip');
          if (s && s.parentNode) s.parentNode.removeChild(s);
        } catch (e) {}

        try {
          const f = document.querySelector('.shadow-floor-text');
          if (f && f.parentNode) f.parentNode.removeChild(f);
        } catch (e) {}

        try {
          const ss = document.getElementById('shadow-floor-text-style');
          if (ss && ss.parentNode) ss.parentNode.removeChild(ss);
        } catch (e) {}

        try { (document.body || document).style.cursor = 'default'; } catch (e) {}
      } catch (err) {}
    };
  }, []);

  const combinedStyle = { ...style };
  if (alwaysOnTop) {
    // use an extremely large z-index to ensure it's above everything on the landing page
    combinedStyle.zIndex = 2147483647;
    combinedStyle.position = combinedStyle.position || 'fixed';
  }

  return (
    <div className={`flying-video ${visible ? "show" : ""}`}
      style={combinedStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
