import EmbeddedPages from "../EmbeddedPages.jsx";

const mediaList = ["https://player.vimeo.com/video/1097114712?"]

export default function HanDaoDanOngPage() {
  return (
    <EmbeddedPages
      mediaList= {mediaList}
        title="THE WRONG BIENNALE"
      date="1 NOV 2025 — 31 MAR 2026"
      artistName="HAN DAO"
      projectName="DAN-ONG.EXE"
      description={
        <>
          <p>
            Using code and automation, I explore how these tools shape our perception and serve as a means to critically analyze and compose Internet video archives. 
            How can automated content generation be harnessed for political, poetic, and critical purposes? 
            This work interrogates the digital footprint produced by the intersection of heteropatriarchy, hypermasculinity, and social media. 
            It features a collage of videos from content creators and Internet celebrities discussing societal expectations—how men should act, 
            how women should behave toward men, and the broader implications of these narratives.
          </p>
        </>
      }
    />
  );
}
