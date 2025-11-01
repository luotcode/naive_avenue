import EmbeddedPages from "../EmbeddedPages.jsx";

const mediaList = ["https://drive.google.com/file/d/1r6q0qL04lbYDiW590mOcJSxGEVEeHFEa/preview",
  "https://www.youtube.com/embed/videoseries?si=45slXPw5Lp27MAj_&amp;list=PL1XPUaT5BfVsW7ynczRD9puWMO-N7uTaa"];

export default function NguyenHoangGiangPage() {
  return (
    <EmbeddedPages
      mediaList={mediaList}
      title = "WRONG BIANELLE"
      date="1 NOV 2025 — 31 MAR 2026"
      artistName="NGUYEN HOANG GIANG"
      projectName="HUMAN-LEARNING (2021)"
      description={
        <>
          <p>
            "The evolution of Artificial Intelligence (AI) has long been driven by our aspiration to create machines that mimic human behavior. 
            As AI systems have progressed from narrow to potentially surpassing human intelligence, new questions arise: Can humans learn from machines? 
            If so, will this lead us to adopt machine-like behaviors, or will it help us rediscover what it means to be human? 
            What are the implications of such learning, and why is it necessary?
          </p>
          <p>In *Human-learning*, four performers were invited to explore these questions. They watched videos of robots and AI 
            agents performing various physical activities—falling, standing up, and playing football. The performers then imitated 
            these movements, choreographing their own interpretations of robotic actions. The result was an informative and surprising 
            exploration, with some performers inventing new movements inspired by their observations.
          </p>
          <p>This video not only documents the learning process but also envisions a future where humans and machines coexist, co-create, 
            and learn from each other."
          </p>
        </>
      }
    />
  );
}
