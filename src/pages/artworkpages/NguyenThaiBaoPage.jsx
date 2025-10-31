import EmbeddedPages from "../EmbeddedPages.jsx";


const mediaList = ["https://youtu.be/QUCQcXQ18Yw",
                  "https://youtu.be/HY-gXhIWkJc",
                  "https://youtu.be/nMVGvOfXJHE"
];

export default function NguyenThaiBaoPage() {
  return (
    <EmbeddedPages
      mediaList={mediaList}
        title="THE WRONG BIANELLE"
      date="1 NOV 2025 — XX XX 2026"
      artistName="NGUYEN THAI BAO"
      projectName="RE-IMPRESSION. WATER LILIES, WATER LILIES;"
      description={
        <>
          <p>
            The artwork employs cellular automata as algorithmic looms, weaving temporal dialogues between Impressionism and Eastern philosophy. Pixels governed by computational destinies of birth, aging, illness and death deconstruct Monet's luminous vibrations into quantum ripples of digital-based lifeforms. AI translates cellular metabolic trajectories, where optical color blending principles resonate with Zen Buddhist perceptions of "eternity within the transient." Each dataflow-crystallized frame becomes an ephemeral manifestation. The West's fixation on ephemeral instants interlaces with the East's enlightenment on eternity within binary causal chains, forming intertextual testimonies – within the algorithmic hourglass, photonic particles persist as both unfinished Impressionist experiments and contemporary reverberations of Eastern awareness in digital dimensions.
          </p>
        </>
      }
    />
  );
}
