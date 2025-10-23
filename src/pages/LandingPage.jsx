import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mountLandingPage } from "./landingpage";
import logoUrl from "/logo.png";

export default function LandingPage() {
  const canvasRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const { dispose } = mountLandingPage(canvasRef.current, navigate);
    return () => dispose();
  }, [navigate]);

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
    </div>
  );
}
