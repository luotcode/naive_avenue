import EmbeddedPages from "../EmbeddedPages.jsx";

const mediaList = ["https://drive.google.com/file/d/1xUJ5Kfz-A1HYASfI3vdm7TM9GCu9AfQL/preview",
  "https://drive.google.com/file/d/1toMCXlDZoj2KcjfQySJw5Z7enw6ydvYf/preview"
];

export default function DangKhangNinhPage() {
  return (
    <EmbeddedPages
      mediaList={mediaList}
      title = "WRONG BIANELLE"
      date="1 NOV 2025 — 31 MAR 2026"
      artistName="DANG KHANG NINH"
      projectName="INTO THE EDEN OF AMBIGUITIES: A WALK WITH AI"
      description={
        <>
          <p>
             A book-length critical essay that discusses how AI impacts human ontology. Based on Martin Heidegger's phenomenology of modern technology, 
             I argue that AI represents the highest ontological danger since it depletes human knowledge and creativity, similarly to how other forms 
             of modern technology have exploited natural resources and human labor. From this parallel, I offer a thesis: We should use environmentalism 
             as an inspiration for how to develop and utilize AI. This approach constitutes an ethical re-orientation named "Eden of Ambiguities," guided 
             by three principles: locality, interconnectedness, and ambiguity.
          </p>
        </>
      }
    />
  );
}
