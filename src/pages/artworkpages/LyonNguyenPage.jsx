import DomePages from "../DomePages.jsx";import "../domepages.css";

export default function LyonNguyenPage() {
  return (
    <DomePages
      mediaSrc="https://youtu.be/Dai7x1cOfZM" 
      title = "WRONG BIANELLE"
      date = "1 NOV 2025 - 31 MAR 2026"
      artistName = "LYON NGUYEN"
      projectName = "DERIVATIVE OF TRIAL A"
      description={
        <>
          <p>
            <br /><br />Dance is ephemeral.

<br /><br />When a performance unfolds on stage, each movement vanishes the moment it appears. Before we can fully register its meaning, the dance has already transitioned into its next gesture. Because of this transience and abstraction, dance is often best perceived as a total experience rather than a collection of isolated motions. Music, set design, costume, symbolism, and other theatrical elements all work together to shape the meaning of a performance.


<br /><br />However, the rise of postmodern dance in the 1960s challenged these conventions. Artists began to reject formal structures and symbolic narratives, turning their attention purely to movement itself. In Yvonne Rainer’s seminal “Trio A”, the dancer performs a continuous series of unconnected motions without music, costume, or theatrical flair - a deliberate act of non-performativity. The work invites audiences to experience dance as abstraction, resisting the instinct to interpret or impose meaning.


<br /><br />Fast forward to today: artificial intelligence has become a tool with limitless potential, extending its reach from the sciences to the arts. In “Derivative of Trio A”, Lyon Nguyen explores the experimental intersection between these two worlds - juxtaposing Rainer’s resistance to analytical frameworks with AI’s inherent drive to analyze and categorize everything.


<br />The experiment unfolds as follows:
<br />Lyon inputs the “Trio A” video into an AI program.
<br />The system is prompted to describe the movements explicitly, in detailed chronological order.
<br />A hired dancer will reconstruct the sequence from this written description - without any knowledge of its source - trying to maintain a similar duration to “Trio A”.
<br />As in Rainer's original work, the new “dance” features no music, costume, or set design.
<br />Lyon records this resulting composition, creating what would be the “first derivative” of “Trio A”.
          
          </p>

        </>
      }
    />
  );
}
