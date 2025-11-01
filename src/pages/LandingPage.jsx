import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mountLandingPage } from "./landingpage";
import logoUrl from "/logo.png";
import MenuOverlay from "../components/menuoverlay";
import FlyingVideo from "../components/flyingvideo";
import flyingVideoSrc from "/assets/The AI dance with us!.webm";

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
    const resetIdleTimer = (e) => {
      if (e?.key === "Shift") return;

      if (!hasInteracted) setHasInteracted(true);
      clearTimeout(idleTimeout.current);
      if (idle) setIdle(false);
      idleTimeout.current = setTimeout(() => setIdle(true), 10000); // Set idle time!!!
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer));

    return () => {
      clearTimeout(idleTimeout.current);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [idle, hasInteracted]);


  // Key press rule when screensaver is active
  useEffect(() => {
    if (!idle) return;

    const handleKeyDown = (e) => {
      if (e.key === "Shift") {
        navigate("/tais-koshino");
      } else {
        setIdle(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [idle, navigate]);

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
            <div className="corner-line">1 NOV 2025 - 31 MAR 2026</div>
          </div>

          <div className="corner right">
            <div className="corner-line">YOU ARE NOW</div>
            <div className="corner-line">INSIDE OF THE PROJECTION</div>
          </div>
        </div>

        {hasInteracted && idle && (
          <>
            <div className="screensaver-navigation">
              <span>Press 'Shift' to Tais Koshino's realm</span>
            </div>
          </>
        )}

        <FlyingVideo src={flyingVideoSrc} alwaysOnTop />
      </div>
  );
}
