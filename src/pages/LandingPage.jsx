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
    

    </div>
  );
}
