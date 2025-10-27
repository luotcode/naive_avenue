import EmbeddedPages from "../EmbeddedPages.jsx";

export default function NguyenHoangGiangPage() {
  return (
    <EmbeddedPages
      mediaSrc="https://youre-so-exotic-looking.netlify.app/"
      title = "WRONG BIANELLE"
      date="1 NOV 2025 — XX XX 2026"
      artistName="HAN DAO"
      projectName="YOU'RE SO EXOTIC LOOKING!"
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
