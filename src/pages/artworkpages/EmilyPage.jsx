import DomePages from "../DomePages.jsx";
import "../domepages.css";

export default function EmilyPage() {
  return (
    <DomePages
      imageSrc="https://player.vimeo.com/video/1130930037"
      title="THE WRONG BIANELLE"
      date="1 NOV 2025 - 31 MAR 2026"
      artistName="EMILY SARTEN"
      projectName="ARTS AND LEISURE (CRYING)"
      description={
        <>
          <p>
            My work investigates the relationship between real and simulated
            relaxation and the disappointment felt in both. Digital escapism as
            well as our inability to show our true feelings through the screen.
          </p>
        </>
      }
    />
  );
}
