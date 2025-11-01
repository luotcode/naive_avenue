import VideoPages from "../VideoPages.jsx";import "../videopages.css";

export default function RicardoBodiniPage() {
  return (
    <VideoPages
      imageSrc="/assets/EineKleine.mp4"
        title="THE WRONG BIANELLE"
      date="1 NOV 2025 - 31 MAR 2026"
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
