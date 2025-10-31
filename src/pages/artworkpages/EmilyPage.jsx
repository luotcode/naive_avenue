import VideoPages from "../videopages.jsx";import "../videopages.css";

export default function EmilyPage() {
  return (
    <VideoPages
      imageSrc="https://www.youtube.com/watch?v=x14bn23DMVE&list=RDx14bn23DMVE&start_radio=1"
      title="WRONG BIANELLE"
      date="1 NOV 2025 - XX XX 2026"
      artistName="EMILY SARTEN"
      projectName="ARTS AND LEISURE (CRYING)"
      description={
        <>
          <p>
            My work investigates the relationship between real and simulated relaxation and the disappointment felt in both. Digital escapeism as well as our inability to show our true feelings through the screen.
          </p>
        </>
      }
    />
  );
}
