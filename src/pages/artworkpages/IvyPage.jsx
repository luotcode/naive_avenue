import DomePages from "../DomePages.jsx";import "../domepages.css";

export default function IvyPage() {
  return (
    <DomePages
      mediaSrc="https://player.vimeo.com/video/1029792275" 
      title = "THE WRONG BIENNALE"
      date = "1 NOV 2025 - 31 MAR 2026"
      artistName = "IVY VO"
      projectName = "G9"
      description={
        <>
          <p>
            G9 (Viet slang for “good night”) is an experimental short film exploring the dream of freedom and the shadow of self-judgment. It follows a Vietnamese roadman on a neon-lit, nocturnal journey into his subconscious. Here, fantasies collide with the shame of desires. Glitchy visuals blur reality and dream, revealing how deeply ingrained norms shape our sense of self, even in our most private moments. G9 captures the paradox of freedom: the harder the roadman chases liberation, the tighter the grip of self-surveillance becomes. It mirrors the holography of selfhood—where each desire acts as a reflection of the whole.
          </p>

        </>
      }
    />
  );
}
