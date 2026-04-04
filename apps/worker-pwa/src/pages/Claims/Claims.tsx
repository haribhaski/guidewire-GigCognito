import { useMemo, useState } from "react";

const CLAIMS = [
  { id: "CLM-001", date: "Apr 4, 2026", time: "11:07 AM", trigger: "Heavy Rainfall", zone: "Koramangala", amount: 416, status: "PAID", hours: 8, fraudScore: 0.12, sources: ["OWM", "IMD"] },
  { id: "CLM-002", date: "Apr 1, 2026", time: "02:14 PM", trigger: "Heavy Rainfall", zone: "Koramangala", amount: 416, status: "PAID", hours: 8, fraudScore: 0.09, sources: ["OWM", "IMD"] },
  { id: "CLM-003", date: "Mar 28, 2026", time: "09:30 AM", trigger: "Severe AQI", zone: "Koramangala", amount: 280, status: "PAID", hours: 4, fraudScore: 0.08, sources: ["WAQI", "CPCB"] },
  { id: "CLM-004", date: "Mar 19, 2026", time: "03:45 PM", trigger: "AQI Advisory", zone: "Koramangala", amount: 0, status: "REJECTED", hours: 0, fraudScore: 0.82, sources: ["WAQI", "CPCB"] },
] as const;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@600;700&display=swap');
  * { box-sizing: border-box; }
  .claims-page { min-height: 100vh; color: var(--gs-text); font-family: 'DM Sans', system-ui, sans-serif; padding-bottom: 96px; }
  .wrap { max-width: 460px; margin: 0 auto; padding: 24px 18px 0; }
  .hero {
    border-radius: 18px;
    border: 1px solid var(--gs-border);
    background:
      radial-gradient(220px 120px at 92% 0%, rgba(75, 205, 255, 0.23), transparent 74%),
      var(--gs-surface);
    padding: 16px;
    margin-bottom: 12px;
  }
  .hero h1 { margin: 0; font-family: 'Sora', sans-serif; font-size: 24px; }
  .hero p { margin: 7px 0 0; color: var(--gs-muted); font-size: 13px; }
  .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 12px; }
  .mini { border: 1px solid var(--gs-border); border-radius: 12px; background: var(--gs-surface); padding: 10px; }
  .mini .k { margin: 0; color: var(--gs-muted); font-size: 10px; }
  .mini .v { margin: 5px 0 0; font-size: 16px; font-weight: 700; font-family: 'Sora', sans-serif; color: #72ddff; }
  .tabs { display: flex; gap: 6px; margin: 12px 0; }
  .tab { flex: 1; border: 1px solid var(--gs-border); border-radius: 10px; background: var(--gs-surface); color: var(--gs-muted); padding: 9px; cursor: pointer; font-weight: 700; font-size: 12px; }
  .tab.active { color: #96e8ff; border-color: rgba(89, 217, 255, 0.42); background: rgba(73, 205, 255, 0.12); }
  .claim {
    border: 1px solid var(--gs-border);
    border-radius: 13px;
    background: var(--gs-surface);
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: border-color 120ms ease;
  }
  .claim:hover { border-color: rgba(89, 217, 255, 0.42); }
  .head { display: flex; justify-content: space-between; gap: 10px; }
  .title { margin: 0; font-size: 14px; font-weight: 700; }
  .sub { margin: 4px 0 0; color: var(--gs-muted); font-size: 12px; }
  .amount { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #79e2ff; text-align: right; }
  .status { margin-top: 4px; font-size: 11px; border-radius: 999px; padding: 3px 8px; display: inline-block; }
  .paid { color: #89e9ff; background: rgba(79, 213, 255, 0.14); border: 1px solid rgba(79, 213, 255, 0.35); }
  .rejected { color: #ff838a; background: rgba(255, 112, 126, 0.12); border: 1px solid rgba(255, 112, 126, 0.3); }
  .details { margin-top: 10px; border-top: 1px solid var(--gs-border); padding-top: 8px; }
  .row { display: flex; justify-content: space-between; gap: 12px; padding: 4px 0; }
  .k { color: var(--gs-muted); font-size: 12px; }
  .v { color: var(--gs-text); font-size: 12px; font-weight: 600; text-align: right; }
`;

export default function Claims() {
  const [filter, setFilter] = useState<"ALL" | "PAID" | "REJECTED">("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "ALL" ? CLAIMS : CLAIMS.filter((claim) => claim.status === filter)),
    [filter]
  );

  const totalPaid = useMemo(
    () => CLAIMS.filter((claim) => claim.status === "PAID").reduce((sum, claim) => sum + claim.amount, 0),
    []
  );

  return (
    <div className="claims-page">
      <style>{STYLES}</style>
      <div className="wrap">
        <div className="hero">
          <h1>Claim Ledger</h1>
          <p>Real-time auto-claim processing with full transparency.</p>

          <div className="summary">
            <div className="mini"><p className="k">Earned Back</p><p className="v">INR {totalPaid}</p></div>
            <div className="mini"><p className="k">Auto Paid</p><p className="v">{CLAIMS.filter((claim) => claim.status === "PAID").length}</p></div>
            <div className="mini"><p className="k">Avg Time</p><p className="v">7m</p></div>
          </div>
        </div>

        <div className="tabs">
          {(["ALL", "PAID", "REJECTED"] as const).map((tab) => (
            <button key={tab} className={`tab ${filter === tab ? "active" : ""}`} onClick={() => setFilter(tab)}>{tab}</button>
          ))}
        </div>

        {filtered.map((claim) => {
          const open = expanded === claim.id;
          return (
            <div key={claim.id} className="claim" onClick={() => setExpanded(open ? null : claim.id)}>
              <div className="head">
                <div>
                  <p className="title">{claim.trigger}</p>
                  <p className="sub">{claim.date} | {claim.time} | {claim.zone}</p>
                </div>
                <div>
                  <div className="amount">{claim.amount > 0 ? `+INR ${claim.amount}` : "INR 0"}</div>
                  <span className={`status ${claim.status === "PAID" ? "paid" : "rejected"}`}>{claim.status}</span>
                </div>
              </div>

              {open && (
                <div className="details">
                  <div className="row"><span className="k">Claim ID</span><span className="v">{claim.id}</span></div>
                  <div className="row"><span className="k">Hours Affected</span><span className="v">{claim.hours || 0}</span></div>
                  <div className="row"><span className="k">Data Sources</span><span className="v">{claim.sources.join(" + ")}</span></div>
                  <div className="row"><span className="k">Fraud Score</span><span className="v">{claim.fraudScore}</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
