import VideoPages from "../VideoPages.jsx";
import "../videopages.css";

export default function ValentinSismannPage() {
  return (
    <VideoPages
      imageSrc="/assets/Valentin Sismann - Picklesong (2025) - Valentin Sismann.mov"
      title="WRONG BIANELLE"
      date="1 NOV 2025 - XX XX 2026"
      artistName="VALENTIN SISMANN"
      projectName="PICKLE SONG"
      description={
        <>
          <p>
            Picklesong is a video piece, a musical system that exists only through a visual process. Here, we examine the question of gesture in a fixed-media work, a work with the notion of “expanded” music. Where does it belong? Is it that of the recorded performer, or that of the medium's manipulation? Is it the result of writing before, during or after recording? And are these different temporalities really what define the gesture? Since inevitably, the only time that exists is the one of the work at the moment of its playback.
          </p>
        </>
      }
    />
  );
}
