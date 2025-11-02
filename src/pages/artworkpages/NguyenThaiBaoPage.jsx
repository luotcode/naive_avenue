import "../embeddedpages.css";
import logoUrl from "/logo.png";
import { useNavigate } from "react-router-dom";
import MenuOverlay from "../../components/menuoverlay";

export default function NguyenThaiBaoPage() {
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
              src="https://www.youtube.com/embed/cz3Swf_GlI4?si=_fR9LDN_aybEatYv&autoplay=1&mute=1&controls=1&loop=1"
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
        <div>NGUYEN THAI BAO</div>
        <div>RE-IMPRESSION. WATER LILIES, WATER LILIES;</div>
      </div>

      <div className="sk-desc">
        
          The artwork employs cellular automata as algorithmic looms, weaving temporal dialogues between Impressionism and Eastern philosophy. Pixels governed by computational destinies of birth, aging, illness and death deconstruct Monet's luminous vibrations into quantum ripples of digital-based lifeforms. AI translates cellular metabolic trajectories, where optical color blending principles resonate with Zen Buddhist perceptions of "eternity within the transient." Each dataflow-crystallized frame becomes an ephemeral manifestation. The West's fixation on ephemeral instants interlaces with the East's enlightenment on eternity within binary causal chains, forming intertextual testimonies – within the algorithmic hourglass, photonic particles persist as both unfinished Impressionist experiments and contemporary reverberations of Eastern awareness in digital dimensions.
        </div>


    </div>
  );
}
