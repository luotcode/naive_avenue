import DomePages from "../DomePages.jsx";
import "../domepages.css";

export default function RicardoBodiniPage() {
  return (
    <>
      <DomePages
        imageSrc="/assets/artworks/little_monster.mp4"
        title="THE WRONG BIANELLE"
        date="1 NOV 2025 - 31 MAR 2026"
        artistName="RICARDO BODINI"
        projectName="LITTLE MONSTER DANCING"
        description={
          <>
            <p>
              Since I am little I draw. Small creatures, funny monsters. They lived on paper, still and silent, but inside my head they were always dancing.
              <br /><br />
              Little Monster Dancing brings these handmade drawings into motion through AI. I feed my creatures into an algorithm that tries to guess how they might move—sometimes graceful, sometimes awkward, sometimes completely unexpected. The machine doesn’t know my monsters, but it tries to imagine them.
              <br /><br />
              The work is playful, but also asks a naïve question: what happens when a drawing learns to move? Is the dance mine, or the machine’s? Naïveté here is not ignorance, but a way of staying open—letting mistakes, surprises, and funny glitches become part of the choreography.
              <br /><br />
              In the age of AI, where control and perfection are often celebrated, Little Monster Dancing insists on the joy of not knowing, of letting things wobble and wander.
            </p>

          </>
        }
      />
      <div
  style={{
    
    inset: 0,
    width: "100vw",
    height: "100vh",
    padding: "5%",
    overflow: "hidden",
  }}
>
  <iframe
    src="https://ricardo-ghosts.netlify.app/"
    style={{
      width: "100%",
      height: "100%",
      border: "none",
      display: "block",
    }}
  ></iframe>
</div>

    </>
  );
}
