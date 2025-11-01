import VideoPages from "../VideoPages.jsx";import "../videopages.css";

export default function EmilyPage() {
  return (
    <VideoPages
      imageSrc="https://www.youtube.com/watch?v=5ftbs4_krzQ&list=RD5ftbs4_krzQ&start_radio=1"
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
