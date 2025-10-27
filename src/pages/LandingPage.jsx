import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mountLandingPage } from "./landingpage";
import logoUrl from "/logo.png";
import MenuOverlay from "../components/menuoverlay";

export default function LandingPage() {
  const canvasRef = useRef();
  const navigate = useNavigate();

  const [idle, setIdle] = useState(false);
  const idleTimeout = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Mount Landing Page Scene
  useEffect(() => {
    const { dispose } = mountLandingPage(canvasRef.current, navigate);
    return () => dispose();
  }, [navigate]);

  // Idle detection
  useEffect(() => {
    const resetIdleTimer = () => {
      if (!hasInteracted) setHasInteracted(true); 
      clearTimeout(idleTimeout.current);
      if (idle) setIdle(false);
      idleTimeout.current = setTimeout(() => setIdle(true), 5000); 
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer));

    return () => {
      clearTimeout(idleTimeout.current);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [idle, hasInteracted]);


  return (
    <div className="stage">
      <canvas ref={canvasRef} className="webgl" />
      <button
        className="brand"
        onClick={() => navigate("/")}
        aria-label="Go to Home"
        title="Home"
      >
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="menu"> <MenuOverlay /> </div>

      <div className="landing-corners">
        <div className="corner left">
          <div className="corner-line">WRONG BIANELLE</div>
          <div className="corner-line">1 NOV 2025 - XX XX 2026</div>
        </div>

        <div className="corner right">
          <div className="corner-line">YOU ARE NOW</div>
          <div className="corner-line">INSIDE OF THE PROJECTION</div>
        </div>
      </div>

      {hasInteracted && idle && (
        <div className="screensaver" onClick={() => setIdle(false)}>
          <video
            src="/assets/EineKleine.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="screensaver-video"
          />
        </div>
      )}
    </div>
  );
}
