import VideoPages from "../VideoPages.jsx";
import "../videopages.css";

export default function EmilyPage() {
  return (
    <VideoPages
      imageSrc="/assets/EineKleine.mp4" 
      title = "WRONG BIANELLE"
      date = "1 NOV 2025 - XX XX 2026"
      artistName = "EMILY SARTEN"
      projectName = "AMAZING PROJECT TITLE"
      description={
        <>
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
        </>
      }
    />
  );
}
