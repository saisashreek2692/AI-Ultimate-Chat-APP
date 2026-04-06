import { useEffect, useState } from "react";
import "../../styles/Flow.css";

export default function Flow() {
  const [flowIdx, setFlowIdx] = useState(0);

  const flowColors = [
    "#5B6EF5",
    "#8B5CF6",
    "#22D3A5",
    "#F59E0B",
    "#38BDF8",
    "#A78BFA",
  ];

  const steps = [
    "📅 Meeting happens",
    "📝 Notes generated",
    "✅ Tasks created",
    "⚡ Workflow triggered",
    "📧 Email sent",
    "📊 Dashboard updated",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowIdx((prev) => (prev + 1) % steps.length);
    }, 900);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <>
      {/* Flow Component */}
      <section className="section" style={{ paddingBottom: 0 }} id="sec-flow">
        <div className="section-eyebrow">Key Differentiator</div>
        <div className="section-title">Connected Intelligence</div>
        <p className="section-sub">
          Other tools are isolated. AIPP's modules talk to each other
          automatically — one event flows through the entire platform.
        </p>
        <div className="flow-demo">
          <div className="flow-title">↓ AUTOMATION CHAIN</div>
          <div className="flow-steps" id="flow-steps">
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div
                  className={`flow-step ${i === flowIdx ? "lit" : ""}`}
                  style={
                    i === flowIdx
                      ? {
                          background: flowColors[i],
                          boxShadow: `0 0 20px ${flowColors[i]}60`,
                          color: "#fff",
                        }
                      : {}
                  }
                >
                  {step}
                </div>
                {/* Arrow (except last item) */}
                {i !== steps.length - 1 && <div className="flow-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
