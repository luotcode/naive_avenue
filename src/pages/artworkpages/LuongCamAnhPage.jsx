import DomePages from "../DomePages.jsx";
import "../domepages.css";
import "./LuongCamAnhPage.css"

export default function LuongCamAnhPage() {
  return (
    <>
    <DomePages
      imageSrc="https://player.vimeo.com/video/890839977" 
      title = "THE WRONG BIENNALE"
      date = "1 NOV 2025 - 31 MAR 2026"
      artistName = "CAM-ANH LUONG"
      projectName = "TROTTIN_AI / TRUSTIN_AI"
      description={
        <>
        </>
      }
    />
    <div className="camanhsection">
      <h1>Reflection on “TrótTin_AI”<br/>(two years on)</h1>
      <p>by Cẩm Anh Lương</p>
      <p>Trót tin (Vietnamese, phrase): “to have already trusted”– to accept that someone has told the truth or has not done something wrong when you cannot prove otherwise.
e.g., trót tin ai đó (“to have trusted someone”).</p>
      <p>
        TrótTin_AI (2023) draws on various data about human belief and festivity; the system responds to movement and presence, so the experience stays non-hierarchical and unsettled, closer to a quantum state than a finished interface. Interaction functions like a ritual of trust and repair: people enter, the work reacts, and together we test what we're willing to believe.
<br/><br/>
Two years on, AI mediates studio work and daily logistics, from drafting and scheduling to the odd “embassy” spam call and the viral doorbell video of improbably cute animals. Each prompt nudges the next decision. My original premise feels both right and unresolved. But, must it be resolved?
      </p>
<br/><br/>
      <img src="/assets/work_camanh.png" width="100%"></img>
      <p><i>Mozilla Hubs (VR Test Bed) - Screenshot from TrótTin_AI's first prototype sessions. (June, 2023)</i></p>
      <p>
        The work has traveled and changed with each site: Carnival of Algorithms (UKAI Projects, Toronto), Festival of Creativity and Design 2023 (Ho Chi Minh City and Hanoi), and the solo After me the deluge / Sau ta là hồng thuỷ at SOMA Art, Berlin (2024). Oddly, with each install I watch a tiny tech funeral. Mozilla Hubs (my VR test bed) drifts away. Kinect II becomes just a webcam. A Google Pose API replaces gestures I once mapped in TouchDesigner. Tools that were "new" quickly became "old," and the installation absorbed these losses as part of its own life.
      </p><br/><br/>
<img src="/assets/work_camanh2.png" width="100%"></img>
      <p><i>Video: Lyon Đạt Nguyễn, intervention performance for TrótTin_AI, Hai An Gallery, Ho Chi Minh City, VFCD 2023.</i></p>
      <p>For VFCD 2023 in Hồ Chí Minh City, working with performer Lyon Đạt Nguyễn, we set a site-specific score while the feed filled with polarized news and counter-news on the Israel–Palestine war (November 2023). The algorithmic mirror was blunt: belief loops tend to show you what you already want to see; power keeps performing itself. Lyon's choreography became a loop: giving, offering, praying, trusting, regenerating; each pass prompting the next question. Naming the fear of “no control” reopened agency in how we designed the performance.
</p>
<p>
For The Wrong Biennale 7 / n41evenue, the work now lives in the browser, more accessible, more echoic. You meet the concept, the responses, the drift, without the full room. Ubiquity has softened my early suspicion of AI, but the core questions persist: how far can machines mediate trust, and where must critical imagination interrupt?
</p>
<p>
To keep agency practical, I lean on techno diversity: multiple stacks, no gatekeeper. On-device pose models sit beside a cloud API; TouchDesigner visual output scenes share work with printed prompts and manual triggers; sound composed by Edoardo Micheli (a real human/artist). There is a visible privacy toggle, no face storage, and a public glitch log so errors are not hidden. Redundancy beats dependency; plurality resists any one pipeline deciding meaning.
</p>
<p>
This trajectory, from experimental platform to lived reality, from festival installation to everyday AI, signals a deeper shift in how we conceive intelligence. Listening to "Quantum × AI: Shaping What's Next" with Hartmut Neven and Dr. Elham Kashefi at the Sensing Quantum Symposium (LAS Art Foundation, Berlin) reframed my thinking. If quantum computation is the natural way of doing computation – embracing the grain of reality rather than resisting it – then classical AI begins to look like an elaborate workaround. Is human intelligence quantum at some level? Could quantum neural networks surface forms of learning or reasoning that more closely resemble biological cognition? Perhaps the future is not merely ‘AI plus quantum acceleration,' but a redefinition of computational intelligence itself.”
</p>
<p>
So the question isn't “How much can I trust AI?” It's who steers the loop, and who is accountable for its drift, bias, and silences? Who holds power, and how do we reverse it? In military AI, International Humanitarian Law reminds us that humans, not systems, must make judgments and bear accountability for their consequences (ICRC, 2025). If accountability remains human at the hardest edges, the artist's studio must embody the same ethic: I want slower agencies, spaces where bodies, sensors, and beliefs stay slightly unsettled, enough to notice control performing itself and to choose, again, how to participate. That's how accountability becomes practice.
<br />At this point, the work does not resolve our questions. Rather, it holds space for ongoing negotiation, a place to continually redraw the social contracts of our digital, shared intelligence, perhaps entered with naïveté but revised through practice and sharpened by doubt. Like any memorable festival, you arrive excited or unsure, surrender to collective momentum, lose yourself for a moment, and then return, gathering again in connection and joy, ready to question once more.
</p>
    </div>
    </>
  );
}
