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

      <div className="sk-stage">
        <div>
            <div className="web-wrapper">
              <iframe
                src="https://kinhchieuai.netlify.app/"
                title="KINH CHIEU AI"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
        </div>
      </div>

      <div className="sk-bl">
        <div>WRONG BIANELLE</div>
        <div>1 NOV 2025 — XX XX 2026</div>
      </div>

      <div className="sk-br">
        <div>NGUYEN HOANG GIA BAO</div>
        <div>KINH CHIEU AI (TOI HANH GIA - GIA THANH TOI)</div>
      </div>

      <div className="sk-desc"><>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. 
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
            ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </></div>
    </div>
  );
}
