import { useNavigate } from "react-router-dom";

const HERO_WORDS = ["Protect", "your", "weekly", "income", "in", "every", "disruption."];

const HERO_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@500;700;800&display=swap');
  * { box-sizing: border-box; }
  .start-root {
    min-height: 100vh;
    color: #eaf2ff;
    font-family: 'DM Sans', system-ui, sans-serif;
    background:
      linear-gradient(180deg, #060c1a 0%, #050a14 100%);
    position: relative;
    overflow: hidden;
  }
  .start-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(88, 214, 255, 0.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(88, 214, 255, 0.09) 1px, transparent 1px);
    background-size: 42px 42px;
    opacity: 0.25;
    pointer-events: none;
  }
  .orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(46px);
    pointer-events: none;
    animation: float 8s ease-in-out infinite;
  }
  .orb.a { width: 260px; height: 260px; background: rgba(57, 194, 255, 0.2); top: -80px; right: -40px; }
  .orb.b { width: 220px; height: 220px; background: rgba(38, 122, 255, 0.22); bottom: 100px; left: -90px; animation-delay: 1.8s; }
  .content {
    position: relative;
    z-index: 2;
    max-width: 460px;
    margin: 0 auto;
    padding: 30px 20px 40px;
  }
  .watermark {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    display: grid;
    place-items: center;
    font-family: 'Sora', sans-serif;
    font-size: clamp(54px, 12vw, 180px);
    font-weight: 800;
    letter-spacing: 0.12em;
    color: rgba(121, 214, 255, 0.06);
    text-transform: uppercase;
    animation: drift 12s ease-in-out infinite;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Sora', sans-serif;
    letter-spacing: 0.08em;
    color: #66d8ff;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 28px;
  }
  .chip {
    border: 1px solid rgba(102, 216, 255, 0.33);
    color: #9de6ff;
    background: rgba(102, 216, 255, 0.11);
    border-radius: 999px;
    display: inline-block;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 14px;
  }
  .title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(32px, 7vw, 48px);
    line-height: 1.08;
    margin: 0;
    font-weight: 800;
  }
  .title .word {
    opacity: 0;
    display: inline-block;
    margin-right: 0.28em;
    animation: wordIn 520ms cubic-bezier(0.2, 0.7, 0, 1) forwards;
  }
  .title .accent { color: #66d8ff; text-shadow: 0 0 22px rgba(102, 216, 255, 0.38); }
  .subtitle {
    margin: 14px 0 0;
    color: rgba(231, 240, 255, 0.74);
    font-size: 16px;
    line-height: 1.6;
    max-width: 34ch;
  }
  .stats {
    margin: 28px 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .stat {
    border: 1px solid rgba(234, 242, 255, 0.16);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(6px);
    padding: 12px;
    animation: riseIn 460ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .stat p { margin: 0; }
  .stat .k {
    color: rgba(231, 240, 255, 0.6);
    font-size: 12px;
    margin-bottom: 4px;
  }
  .stat .v {
    font-family: 'Sora', sans-serif;
    color: #7bddff;
    font-size: 22px;
    font-weight: 700;
  }
  .cta {
    margin-top: 30px;
    width: 100%;
    border: none;
    border-radius: 14px;
    padding: 15px 18px;
    background: linear-gradient(90deg, #1f97ff 0%, #49d3ff 100%);
    color: #eaf6ff;
    font-size: 17px;
    font-weight: 800;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    box-shadow: 0 14px 40px rgba(49, 182, 255, 0.32);
    transition: transform 140ms ease, box-shadow 140ms ease;
  }
  .cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 40px rgba(49, 182, 255, 0.42);
  }
  .notes {
    margin-top: 12px;
    text-align: center;
    color: rgba(231, 240, 255, 0.5);
    font-size: 12px;
  }
  @keyframes riseIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-14px); }
  }
  @keyframes wordIn {
    from { opacity: 0; transform: translateY(16px); filter: blur(4px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes drift {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`;

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="start-root">
      <style>{HERO_STYLES}</style>
      <div className="watermark">KARYAKAVACH</div>
      <div className="orb a" />
      <div className="orb b" />

      <div className="content">
        <div className="brand">KARYAKAVACH</div>
        <div className="chip">Trusted income shield for delivery riders</div>
        <h1 className="title" aria-label="Protect your weekly income in every disruption.">
          {HERO_WORDS.map((word, index) => (
            <span
              key={word}
              className={`word ${word === "weekly" || word === "income" ? "accent" : ""}`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="subtitle">
          Real-time weather and zone triggers. Instant UPI payout. Zero paperwork.
        </p>

        <div className="stats">
          <div className="stat">
            <p className="k">Claim settlement time</p>
            <p className="v">~5 min</p>
          </div>
          <div className="stat">
            <p className="k">Trigger checks</p>
            <p className="v">Every 15m</p>
          </div>
          <div className="stat">
            <p className="k">Coverage model</p>
            <p className="v">Parametric</p>
          </div>
          <div className="stat">
            <p className="k">Payout mode</p>
            <p className="v">UPI Auto</p>
          </div>
        </div>

        <button type="button" className="cta" onClick={() => navigate("/onboarding")}>Get Started</button>
        <div className="notes">KARYAKAVACH | Built for Zepto and Blinkit delivery partners</div>
      </div>
    </div>
  );
}
