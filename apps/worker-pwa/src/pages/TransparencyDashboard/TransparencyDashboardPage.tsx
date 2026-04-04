import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type DashboardData = {
  zone: string;
  payoutPool: number;
  riskSignals: string[];
  activeTriggers: string[];
  lastPayout: string | null;
  currentTempC?: number | null;
  currentAqi?: number | null;
  currentRainMm1h?: number | null;
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@600;700&display=swap');
  * { box-sizing: border-box; }
  .trans-page {
    min-height: 100vh;
    color: var(--gs-text);
    font-family: 'DM Sans', system-ui, sans-serif;
    padding-bottom: 96px;
  }
  .wrap {
    max-width: 460px;
    margin: 0 auto;
    padding: 24px 18px 0;
  }
  .head {
    border: 1px solid var(--gs-border);
    border-radius: 16px;
    background: var(--gs-surface);
    padding: 14px;
    margin-bottom: 12px;
    animation: riseIn 420ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .head h1 {
    margin: 0;
    font-family: 'Sora', sans-serif;
    font-size: 22px;
  }
  .head p {
    margin: 8px 0 0;
    color: var(--gs-muted);
    font-size: 13px;
    line-height: 1.5;
  }
  .metric-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin: 10px 0 12px;
  }
  .metric {
    border-radius: 12px;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    padding: 10px;
  }
  .metric .k { margin: 0; font-size: 11px; color: var(--gs-muted); }
  .metric .v { margin: 4px 0 0; font-size: 16px; font-weight: 700; font-family: 'Sora', sans-serif; }
  .card {
    border-radius: 14px;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    padding: 12px;
    margin-bottom: 10px;
    animation: riseIn 470ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--gs-border);
    padding: 7px 0;
    gap: 10px;
  }
  .row:last-child { border-bottom: none; }
  .row .k { color: var(--gs-muted); font-size: 12px; }
  .row .v { color: var(--gs-text); font-size: 13px; font-weight: 600; text-align: right; }
  .chip-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    border-radius: 999px;
    border: 1px solid rgba(52, 162, 255, 0.35);
    background: rgba(52, 162, 255, 0.13);
    color: #89c9ff;
    font-size: 12px;
    padding: 5px 8px;
  }
  .empty {
    color: var(--gs-muted);
    font-size: 13px;
  }
  @keyframes riseIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function TransparencyDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("gs_token");

    fetch(`${API_BASE}/api/worker-dashboard/overview`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load overview");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Unable to load transparency data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="trans-page">
        <style>{STYLES}</style>
        <div className="wrap">Loading transparency dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="trans-page">
        <style>{STYLES}</style>
        <div className="wrap">{error || "No data available"}</div>
      </div>
    );
  }

  return (
    <div className="trans-page">
      <style>{STYLES}</style>
      <div className="wrap">
        <div className="head">
          <h1>Transparency Dashboard</h1>
          <p>Clear view of live zone conditions, active triggers, and payout operations.</p>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <p className="k">AQI</p>
            <p className="v" style={{ color: "#ff944d" }}>{data.currentAqi ?? "--"}</p>
          </div>
          <div className="metric">
            <p className="k">Temp</p>
            <p className="v" style={{ color: "#ffbe3d" }}>{data.currentTempC ?? "--"}</p>
          </div>
          <div className="metric">
            <p className="k">Rain 1h</p>
            <p className="v" style={{ color: "#34a2ff" }}>{data.currentRainMm1h ?? "--"}</p>
          </div>
        </div>

        <div className="card">
          <div className="row">
            <span className="k">Zone</span>
            <span className="v">{data.zone}</span>
          </div>
          <div className="row">
            <span className="k">Payout Pool</span>
            <span className="v">INR {data.payoutPool.toLocaleString()}</span>
          </div>
          <div className="row">
            <span className="k">Last Payout</span>
            <span className="v">{data.lastPayout || "No payout yet"}</span>
          </div>
        </div>

        <div className="card">
          <div className="row" style={{ borderBottom: "none", paddingBottom: 0 }}>
            <span className="k">Active Triggers</span>
          </div>
          {data.activeTriggers.length ? (
            <div className="chip-wrap" style={{ marginTop: 8 }}>
              {data.activeTriggers.map((trigger) => (
                <span className="chip" key={trigger}>{trigger}</span>
              ))}
            </div>
          ) : (
            <div className="empty" style={{ marginTop: 8 }}>No active triggers right now.</div>
          )}
        </div>

        <div className="card">
          <div className="row" style={{ borderBottom: "none", paddingBottom: 0 }}>
            <span className="k">Risk Signals</span>
          </div>
          {data.riskSignals.length ? (
            <div className="chip-wrap" style={{ marginTop: 8 }}>
              {data.riskSignals.map((signal, idx) => (
                <span className="chip" key={`${signal}-${idx}`}>{signal}</span>
              ))}
            </div>
          ) : (
            <div className="empty" style={{ marginTop: 8 }}>No risk signals currently detected.</div>
          )}
        </div>
      </div>
    </div>
  );
}
