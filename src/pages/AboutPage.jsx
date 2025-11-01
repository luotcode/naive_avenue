import "./aboutpage.css";
import logoUrl from "/logo.png";
import MenuOverlay from "../components/menuoverlay";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <button className="brand" onClick={() => navigate("/")}>
        <img src={logoUrl} alt="Logo" />
      </button>

      <div className="menu">
        <MenuOverlay />
      </div>

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

      <div className="about-container">
        <div
          className="ellipse ellipse-1"
          style={{ transform: `translate(-50%, ${scrollY * 0.2}px)` }}
        />
        <div
          className="ellipse ellipse-2"
          style={{ transform: `translate(-50%, ${scrollY * 0.3}px)` }}
        />
        <div
          className="ellipse ellipse-3"
          style={{ transform: `translate(-50%, ${scrollY * 0.4}px)` }}
        />
        <div className="about-content">
          <p>
            In a world increasingly shaped by artificial intelligence, naïveté
            becomes both accusation and invitation. Too curious. Too slow. Too
            hopeful. Too easily convinced.
          </p>

          <p>
            As AI ascends, naïveté, presaging the unknown and the failures to
            know, is promised to be effaced in pursuit of perfection &amp;
            optimization. Uncertainty is to be predicted; ignorance, filled in at
            any cost.
          </p>

          <p>
            And yet, a thread of the naïve runs through every tale we tell,
            surfacing in the frictions underlying fleeting sensations:
            fascinations, fears, and eerie pauses of familiarity with the
            artificial. Never knowing enough, yet caught between fracturing
            visions of truth, we invite you to linger in this space of unknowing
            and discomfort, to look a bit closer at what it means to be ‘too
            naive’ in face of AI:
          </p>

          <p>
            Naivete, as an attitude, is then imagined as a gesture of refusal – of
            not readily embracing what is told as such, or being too ready for it
            to the point of absurdity.
          </p>

          <p>
            Tracing this blurry line within our entangled interactions, what are
            the hidden values and thresholds we must face as we navigate ways
            through which AI is now interwoven in our daily lives? Accompanying us
            through a playful, sometimes aloof wander, participating artists
            explore these tensions through experimentation with AI as medium,
            concept, and system. Tracing the contours of misunderstanding, belief,
            hesitation, and intimacy with curiosity, the works ask of us the
            values of looking otherwise, in failing to obey existing rules.
          </p>

          <p className="about-highlight">
            ♣♣  ωｅĹⒸσм𝐄 ƳⓞⓊ t๏ #Ⓝ/α:𝔫４❶vᗴ𝓐𝐕ＥŇＵε ✎👊
          </p>

          <h3 className="section-header">CONTRIBUTING ARTISTS</h3>
          <p>
            <span className="charmonman">Cẩm-Anh Lương, Đặng Khang Ninh, Emily Sarten, Hà Thảo, Hân Đào, Ivy
            Vo, Lê Thanh Thảo, lphg, Lyon Nguyễn, Nicola Bertoglio, Nguyễn Thái
            Bảo, Nguyễn Hoàng Gia Bảo, Nguyễn Hoàng Giang, Ricardo Bodini, Taís
            Koshino, Valentin Sismann.</span>
          </p>

          <p>Curated by Nhi Phan, in collaboration with CodeSurfing.</p>

          <h3 className="section-header">SPECIAL THANKS TO</h3>
          <p>
            <span className="charmonman">Can Trương</span> – Exhibition Coordinator
            <br />
            <span className="charmonman">Minh Tâm</span> &amp; <span className="charmonman">Ivy Võ</span> – Developer &amp; Web Designer
            <br />
            <span className="charmonman">Dr. Gunalan Nadarajan</span>,
            <br />
            <span className="charmonman">Vân Anh Lê</span>,
            <br />
            <span className="charmonman">Hà Châu Bảo Nhi</span>,
            <br />
            <span className="charmonman">Hoàng Phạm Gia Khang</span>,
            <br />
            – for supporting the making of this exhibition
          </p>

          <div className="org-section">
            <div className="org-grid">
              <div className="org-item">
                <div style={{ position: 'relative', width: 391, height: 293, overflow: 'hidden' }}>
                  <img src="/assets/about/light.png" alt="background light" style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', objectFit: 'contain', transform: 'translate(-50%, -50%)' }} />
                  <img src="/assets/about/LOGO2.001.png" alt="The Wrong Biennale" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '55%', height: 'auto' }} />
                </div>
                <p>
                  <strong>The Wrong Biennale</strong> is a global, independent, and
                  non-profit digital art biennial that highlights creativity through a
                  decentralized and collaborative format. Since 2013, it has grown into a
                  major international platform, showcasing a wide range of digital art by
                  both established and emerging artists. Held every two years, The Wrong
                  functions as a biennial of exhibitions – bringing together hundreds of
                  independently curated online pavilions and offline embassies across the
                  world. These exhibitions form a vast, interconnected network that invites
                  audiences to experience digital art in diverse formats and contexts. With
                  over 10,000 participants and 800+ exhibitions worldwide, The Wrong has
                  earned international acclaim, including recognition from the European
                  Commission’s S+T+ARTS Prize and SOIS Cultura. It is also a member of the
                  International Biennial Association (IBA).
                </p>
                <p>
                  Find out more about The Wrong Biennale and other pavilions &amp; embassies
                  that are coming together this year at:{" "}
                  <a href="https://thewrong.org/" target="_blank" rel="noreferrer">
                    https://thewrong.org/
                  </a>
                </p>
              </div>

              <div className="org-item">
                <div style={{ position: 'relative', width: 391, height: 293, overflow: 'hidden' }}>
                  <img src="/assets/about/light.png" alt="background light" style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', objectFit: 'contain', transform: 'translate(-50%, -50%)' }} />
                  <img src="/assets/about/CodeSurfing logo.png" alt="CodeSurfing (Lướt Code)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '55%', height: 'auto' }} />
                </div>
                <p>
                  <strong>CodeSurfing (Lướt Code)</strong> is an art-tech collective
                  emerging from Ho Chi Minh City. Situated within the field of
                  digital humanities, the collective develops public programs,
                  curricular experiments, and collaborative research that connect
                  local communities with wider regional and international networks.
                  Its work promotes interdisciplinary inquiry across art, technology,
                  and the humanities and seeks to expand the boundaries and spaces of
                  artistic practice through the use of computational languages.
                </p>
                <p>
                  CodeSurfing’s projects have been presented at the Vietnam Women’s
                  Museum in Hanoi, received the FutureTense Award in Hong Kong, and
                  were shortlisted as finalists for the Lumen Prize. The collective
                  is currently stewarded by Nhan Phan, Yui Nguyen, and Khoi Nguyen.
                </p>
              </div>

              <div className="org-item">
                <div style={{ position: 'relative', width: 391, height: 293, overflow: 'hidden' }}>
                  <img src="/assets/about/light.png" alt="background light" style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', objectFit: 'contain', transform: 'translate(-50%, -50%)' }} />
                  <img src="/assets/about/Nhi Phan.png" alt="Nhi Phan" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '55%', height: 'auto' }} />
                </div>
                <p>
                  <strong>Nhi Phan</strong> is an art practitioner currently living
                  and working in Ho Chi Minh City, Vietnam. She holds a Bachelor’s
                  degree in Social Studies with double minors in Art History and
                  History from Fulbright University Vietnam.
                </p>
                <p>
                  Nhi’s practice lies at the intersection of contemporary art and
                  anthropological methods, with a particular interest in community-
                  based participatory approaches within the Vietnamese context.
                  Through curatorial and research practices, she explores questions
                  surrounding social interaction, forms of knowledge production, and
                  open-ended interdisciplinary dialogues.
                </p>
                <p>
                  She has collaborated with Sàn Art and Heritage Art Space,
                  contributing to curatorial processes, community programming, and
                  translation publications. Her writings and translations have
                  appeared in Hanoi Grapevine Finest Reviews 2023 and Month of Art
                  Practice 2023–2024 (MAP).
                </p>
              </div>

              <div className="org-item">
                <div style={{ position: 'relative', width: 391, height: 293, overflow: 'hidden' }}>
                  <img src="/assets/about/light.png" alt="background light" style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', objectFit: 'contain', transform: 'translate(-50%, -50%)' }} />
                  <img src="/assets/about/Contact.png" alt="contact" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '55%', height: 'auto' }} />
                </div>
                <p>
                  Contact us via:
                  <br />
                  n41ve.avenue.info@gmail.com
                  <br />
                  IG: @n41ve.avenue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
