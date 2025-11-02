import EmbeddedPages from "../EmbeddedPages.jsx";
const mediaList = ["https://youre-so-exotic-looking.netlify.app/"]
export default function HanDaoDanOngPage() {
  return (
    <EmbeddedPages
      mediaList = {mediaList}
      title = "WRONG BIANELLE"
      date="1 NOV 2025 — 31 MAR 2026"
      artistName="HAN DAO"
      projectName="YOU'RE SO EXOTIC LOOKING!"
      description={
        <>
          <p>
            "“You're so exotic looking!” is an interactive web poem that explores the complex issues surrounding the commodification of Asian women, particularly through the phenomenon of mail-order brides and the fetishization of Asian women commonly referred to as ""yellow fever"".
          </p>
          <p>
This interactive poem project delves into the harmful stereotypes surrounding Asian women, which have been perpetuated by Western films and media. These portrayals have presented Asian women as hyper-sexual and hyper-heterosexual, and presenting them as perfect complements to the exaggerated masculinity of White Men. This reinforces male-centered and male-dominated ideologies, where Asian women are expected to exist solely to serve men and be sexually consumed by them."
          </p>
        </>
      }
    />
  );
}
