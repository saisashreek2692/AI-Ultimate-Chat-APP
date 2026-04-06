import "../../styles/Architecture.css";

export default function Architecture() {
  return (
    <>
      <section className="section" id="sec-arch">
        <div className="section-eyebrow">System Architecture</div>
        <div className="section-title">Built to Scale</div>
        <p className="section-sub">
          Microservices on Kubernetes, event-driven with Kafka, vector memory
          for AI context, edge-ready CDN.
        </p>

        <div className="arch-section">
          <div className="arch-grid">
            <div className="arch-layer">
              <div className="arch-layer-label" style={{ color: "#5b6ef5" }}>
                Frontend
              </div>
              <div className="arch-tech">
                <div className="tech-badge">Next.js + React</div>
                <div className="tech-badge">Tailwind CSS</div>
                <div className="tech-badge">Micro-frontends</div>
                <div className="tech-badge">Docker</div>
                <div className="tech-badge">Kubernetes</div>
              </div>
            </div>
            <div className="arch-layer">
              <div className="arch-layer-label" style={{ color: "#a78bfa" }}>
                Backend
              </div>
              <div className="arch-tech">
                <div className="tech-badge">Spring Boot</div>
                <div className="tech-badge">Auth Service</div>
                <div className="tech-badge">AI Orchestrator</div>
                <div className="tech-badge">Workflow Engine</div>
                <div className="tech-badge">Notification Svc</div>
              </div>
            </div>
            <div className="arch-layer">
              <div className="arch-layer-label" style={{ color: "#38bdf8" }}>
                AI Layer
              </div>
              <div className="arch-tech">
                <div className="tech-badge">LLM APIs</div>
                <div className="tech-badge">Vector DB</div>
                <div className="tech-badge">Prompt Engine</div>
                <div className="tech-badge">OpenAI / Claude</div>
                <div className="tech-badge">Embedding Models</div>
              </div>
            </div>
            <div className="arch-layer">
              <div className="arch-layer-label" style={{ color: "#22d3a5" }}>
                Infrastructure
              </div>
              <div className="arch-tech">
                <div className="tech-badge">GKE / EKS</div>
                <div className="tech-badge">AWS S3 + RDS</div>
                <div className="tech-badge">Kafka Streaming</div>
                <div className="tech-badge">Redis Cache</div>
                <div className="tech-badge">Lambda Functions</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
