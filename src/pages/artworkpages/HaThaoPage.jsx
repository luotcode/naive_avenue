import "../embeddedpages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import MenuOverlay from "../../components/menuoverlay";

export default function NguyenHoangGiaBaoPage() {
  const navigate = useNavigate();

  return (
    <div className="sk-page">
      <button className="sk-brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="sk-menu">
        <MenuOverlay />
      </div>

      <div className="sk-stage" style={{height: "100vh"}}>
        <div>
            <div className="web-wrapper">
              <iframe
  width="100%"
  height="100vh"
  src="https://www.youtube.com/embed/YUIo4IJ8zRg?autoplay=1&mute=1&controls=1&loop=1&playlist=YUIo4IJ8zRg"
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
        <div>WRONG BIANELLE</div>
        <div>1 NOV 2025 — 31 MAR 2026</div>
      </div>

      <div className="sk-br">
        <div>HA THAO</div>
        <div>ARTIFICIAL DIVINITY</div>
      </div>

      <div className="sk-desc"><>
          <p>
            My question: Will mothers protect me from AI?

<br /><br />Artificial Divinity imagines a parallel timeline where an almighty Mother Goddess rises to shield humanity from technological determinism. She embodies a counterforce to artificial intelligence — a reminder of the sacredness of creation.
<br /><br />Her form emerges from 3D scans of mother figures (all carrying their sons) found on urban streets, combined with self-drying clay. Her myth begins when the sons whisper their fears of an unnatural being with a vision of data. In response, the mothers gather and are resurrected at Tràng Thi Park, standing as guardians against the encroaching force of technology.
          </p>

          <br /><br />
           <div className="sk-mediaFrame" style={{ marginTop: "20vh" }}>

            <div className="web-wrapper">
                  <iframe
                    src="https://drive.google.com/file/d/1o8u05oNPFWbQwZ5gJ8FJI7uzDF8RrY0d/preview"                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>          </div>
        </></div>

       
    </div>
  );
}
