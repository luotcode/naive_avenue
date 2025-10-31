import EmbeddedPages from "../EmbeddedPages.jsx";

const mediaList = ["https://drive.google.com/file/d/1Ypx3yhqP3lAUiOBW1HW2pRWG1Am7_aNt/view",
                    "https://drive.google.com/file/d/14chRbrQVMoQj9V8zqfJxb-p8S3q15irI/view?usp=sharing",
];

export default function HaThaoPage() {
  return (
    <EmbeddedPages
      mediaList={mediaList}
      title="THE WRONG BIANELLE"
      date="1 NOV 2025 — XX XX 2026"
      artistName="HA THAO"
      projectName="THE CHRONICLE OF ARTIFICIAL DIVINITY"
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
