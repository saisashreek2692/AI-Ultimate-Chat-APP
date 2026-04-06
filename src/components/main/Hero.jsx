import "../../styles/Hero.css";

export default function Hero({ setSection }) {
  return (
    <>
      {/* Hero Block */}
      <section className="hero" id="sec-overview">
        <div className="hero-eyebrow">
          <span></span> AI Unified Productivity Platform
        </div>
        <h1>
          One platform.
          <br />
          <span className="grad">Everything you build.</span>
        </h1>
        <p className="hero-sub">
          Chat, code, create, automate, design, meet, manage — all wired
          together by a single AI brain. The end of app-switching.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => setSection('modules')}>
            Explore Modules
          </button>
          <button className="btn-ghost" onClick={() => setSection('arch')}>
            See Architecture
          </button>
        </div>
      </section>
    </>
  );
}
