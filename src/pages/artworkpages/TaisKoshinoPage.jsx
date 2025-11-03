import DomePages from "../DomePages.jsx";
import "../domepages.css";

export default function TaisKoshinoPage() {
  return (
    <DomePages
          imageSrc="https://player.vimeo.com/video/865681389"
          title="THE WRONG BIENNALE"
          date="1 NOV 2025 - 31 MAR 2026"
          artistName="TAIS KOSHINO"
          projectName="LATE SUMMER DAYS"
          description={
            <>
              <p>
               on late summer days,<br/>
in the middle of the woods, I’ve squatted<br/>
with a machine to record a pillow of<br/>
shells<br/>
in my house, I’d sat with a machine,<br/>
evoking miroco<br/>
I ́ve gave yoko’s instructions, it answered<br/>
me with images<br/>
we went to a cosmos sprout’s field<br/>
interwining their images with me<br/>
in your mind<br/>
              </p>
            </>
          }
        />
  );
}
