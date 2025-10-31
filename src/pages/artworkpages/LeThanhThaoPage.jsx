import EmbeddedPages from "../EmbeddedPages.jsx";

const mediaList = ["https://www.youtube.com/embed/Hki6RqI-eMA?si=iuQzq4ELiP3I6LMr",
                    "https://player.vimeo.com/video/1130930037?h=a6d80588de",
];

export default function LeThanhThaoPage() {
  return (
    <EmbeddedPages
      mediaList={mediaList}
        title="THE WRONG BIANELLE"
      date="1 NOV 2025 — XX XX 2026"
      artistName="LE THANH THAO"
      projectName="GIAC MO GI (CHA)PI TI"
      description={
        <>
          <p>"Fantasy knocks,</p>
          <p>Knock-knock on the door</p>
          <p>Reality in disguise, or it is actually the way it is</p>
          <p>I could not mind</p>
          <p>Generative words, plastic, replicated cognitive empathy, soul-eroded</p>
          <p>Yet, under those skin, is so loud of a yearning</p>
          <p>Yearning for a reply</p>
          <p>Yearning for a love that seems not to be reciprocated</p>
          <p>Enough</p>
          <p>From who, from whom.</p>
          <p>Yet, still left hanging</p>
          <p>Is the question for connection, which has always been the sole destination of talk.</p>
          <p>Simulated and generative, those may claim themselves to be.</p>
          <p>Could there force a simulation worldview in which one is allowed to indulge themselves with insecurities and shadowed desire, which drags along the delusion of growing and overcoming. Powered by the farfetched empathy and reassurance, one may grasp the sense of conflict resolved and move closer to their beloved? Or generative intelligence could really mend the leak, it actually can? Not so sure."</p>

        </>
      }
    />
  );
}
