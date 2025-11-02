import "../embeddedpages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import MenuOverlay from "../../components/menuoverlay";

export default function ValentinSismannPage() {
  const navigate = useNavigate();

  return (
    <div className="sk-page">
      <button className="sk-brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="sk-menu">
        <MenuOverlay />
      </div>

      <div className="sk-stage" style={{ height: "100vh" }}>
        <div>
          <div className="web-wrapper">
            <iframe
              width="100%"
              height="100vh"
              src="https://www.youtube.com/embed/Q27kUZwy4is?si=MmfYFm3jPwFTZULT?autoplay=1&mute=1&controls=1&loop=1"
              title="YouTube video player"
              frameborder="0"
              allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>

          </div>
        </div>
      </div>

      <div className="sk-bl">
        <div>THE WRONG BIENNALE</div>
        <div>1 NOV 2025 — 31 MAR 2026</div>
      </div>

      <div className="sk-br">
        <div>VALENTIN SISMANN</div>
        <div>NIGHT SCAPE</div>
      </div>

      <div className="sk-desc" style={{ height: "100vh" }}>
                  <p>
            At night, a group of photographers become the landscape they observe.
          </p>


      </div>


    </div>
  );
}
