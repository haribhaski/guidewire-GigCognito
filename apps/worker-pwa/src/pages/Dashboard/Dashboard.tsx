import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');
  * { box-sizing: border-box; }
  .dash-page {
    min-height: 100vh;
    padding-bottom: 90px;
    color: var(--gs-text);
    background: transparent;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .dash-wrap {
    max-width: 460px;
    margin: 0 auto;
    padding: 28px 18px 0;
  }
  .hero {
    border: 1px solid var(--gs-border);
    border-radius: 20px;
    padding: 16px;
    background:
      radial-gradient(230px 130px at 10% 0%, rgba(52, 162, 255, 0.2), transparent 72%),
      radial-gradient(220px 130px at 88% 10%, rgba(28, 194, 145, 0.15), transparent 70%),
      var(--gs-surface);
    backdrop-filter: blur(8px);
    animation: riseIn 460ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .metric-card {
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    border-radius: 14px;
    padding: 12px;
    animation: riseIn 420ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .stats-card {
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    border-radius: 14px;
    padding: 14px;
    animation: riseIn 520ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .section-title {
    font-size: 12px;
    letter-spacing: 0.08em;
    margin: 20px 0 10px;
    color: var(--gs-muted);
    font-weight: 700;
  }
  .alert-card {
    border: 1px solid var(--gs-border);
    border-radius: 14px;
    padding: 13px;
    margin-bottom: 10px;
    background: var(--gs-surface);
    animation: slideIn 400ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    box-shadow: 0 0 0 0 currentColor;
    animation: pulse 1.8s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 currentColor; }
    70% { box-shadow: 0 0 0 8px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
  }
  @keyframes riseIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @media (max-width: 380px) {
    .grid-3 {
      grid-template-columns: 1fr;
    }
  }
`;

type DashboardApiResponse = {
  zone: string;
  zoneRisk?: string;
  seasonContext?: string;
  workerName?: string;
  earnedThisWeek?: number;
  claimsThisWeek?: number;
  riskSignals?: string[];
  currentTempC?: number | null;
  currentAqi?: number | null;
  currentRainMm1h?: number | null;
  currentWeatherText?: string | null;
  recentPayouts?: Array<{ amount: number; status: string; trigger: string; date: string }>;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardApiResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [apiState, setApiState] = useState<"loading" | "live" | "error" | "live-lite">("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      setLoadingDashboard(true);
      setApiState("loading");

      try {
        const token = localStorage.getItem("gs_token");
        const res = await fetch(`${API_BASE}/api/worker-dashboard/overview`, {
          signal: controller.signal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = (await res.json()) as DashboardApiResponse;
          setDashboardData(data);
          setApiState("live");
          return;
        }

        const zoneId = localStorage.getItem("gs_zone_id") || "BLR_KOR_01";
        const fallbackRes = await fetch(
          `${API_BASE}/api/worker-dashboard/live-overview?zoneId=${encodeURIComponent(zoneId)}`,
          { signal: controller.signal }
        );

        if (!fallbackRes.ok) {
          throw new Error(`Dashboard fallback failed: ${fallbackRes.status}`);
        }

        const fallbackData = (await fallbackRes.json()) as DashboardApiResponse;
        setDashboardData(fallbackData);
        setApiState("live-lite");
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("[Dashboard] Failed to load dashboard data", err);
          setDashboardData(null);
          setApiState("error");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDashboard(false);
        }
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, []);

  const currentWorkerName = dashboardData?.workerName || "Worker";
  const currentZone = dashboardData?.zone || "No zone data";
  const currentZoneRisk = (dashboardData?.zoneRisk || "MEDIUM").toUpperCase();
  const currentRisk = useMemo(() => {
    const isHigh = currentZoneRisk === "HIGH";
    const isLow = currentZoneRisk === "LOW";
    return {
      label: currentZoneRisk,
      color: isHigh ? "#ff6363" : isLow ? "#1cc291" : "#ffbe3d",
      bg: isHigh ? "rgba(255,99,99,0.14)" : isLow ? "rgba(28,194,145,0.14)" : "rgba(255,190,61,0.14)",
      bar: isHigh ? 80 : isLow ? 34 : 58,
    };
  }, [currentZoneRisk]);

  const currentEarned = dashboardData?.earnedThisWeek ?? 0;
  const currentClaims = dashboardData?.claimsThisWeek ?? 0;
  const dynamicAlerts =
    dashboardData?.riskSignals && dashboardData.riskSignals.length
      ? dashboardData.riskSignals.map((signal, idx) => ({
          id: idx + 1,
          title: signal,
          desc: `${signal} detected in ${currentZone}`,
          time: "Live",
          severity: signal.toLowerCase().includes("heavy") ? "high" : "medium",
        }))
      : [];
  const dynamicPayouts =
    dashboardData?.recentPayouts && dashboardData.recentPayouts.length
      ? dashboardData.recentPayouts.map((p, idx) => ({
          id: idx + 1,
          date: new Date(p.date).toLocaleDateString(),
          amount: p.amount,
          reason: `Trigger ${p.trigger.slice(0, 8)} — ${currentZone}`,
          status: p.status,
        }))
      : [];

  const liveTemp = dashboardData?.currentTempC;
  const liveAqi = dashboardData?.currentAqi;
  const liveRain = dashboardData?.currentRainMm1h;
  const liveWeatherText = dashboardData?.currentWeatherText || "No weather text available";

  const seasonLabel = dashboardData?.seasonContext || "Risk conditions monitored";
  const apiLabel = apiState === "live"
    ? "Live API"
    : apiState === "live-lite"
      ? "Live API Lite"
      : apiState === "error"
        ? "API unavailable"
        : "Loading API";
  const apiColor = apiState === "live" ? "#1cc291" : apiState === "live-lite" ? "#34a2ff" : apiState === "error" ? "#ff6363" : "#ffbe3d";

  const conditionCards = [
    { label: "AQI Now", value: liveAqi === null || liveAqi === undefined ? "--" : `${liveAqi}`, color: "#ff944d" },
    { label: "Temp", value: liveTemp === null || liveTemp === undefined ? "--" : `${liveTemp.toFixed(1)}C`, color: "#ffbe3d" },
    { label: "Rain 1h", value: liveRain === null || liveRain === undefined ? "--" : `${liveRain.toFixed(1)}mm`, color: "#34a2ff" },
  ];

  return (
    <div className="dash-page">
      <style>{STYLES}</style>

      <div className="dash-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <span style={{ fontFamily: "'Sora', system-ui, sans-serif", color: "var(--gs-accent)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>KARYAKAVACH</span>
            <p style={{ margin: "4px 0 0", fontSize: 16, color: "var(--gs-text)", fontWeight: 600 }}>Hi, {currentWorkerName.split(" ")[0]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--gs-surface)", border: "1px solid var(--gs-border)", borderRadius: 999, padding: "6px 11px", color: apiColor }}>
            <span className="status-dot" style={{ background: apiColor }} />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{apiLabel}</span>
          </div>
        </div>

        <div className="hero">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--gs-muted)", letterSpacing: "0.06em", fontWeight: 700 }}>ZONE RISK TODAY</p>
              <p style={{ margin: "5px 0 0", fontSize: 24, fontWeight: 700, color: "var(--gs-text)" }}>{currentZone}</p>
            </div>
            <div style={{ background: currentRisk.bg, border: `1px solid ${currentRisk.color}44`, borderRadius: 10, padding: "6px 11px" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: currentRisk.color }}>{currentRisk.label} RISK</span>
            </div>
          </div>
          <div style={{ height: 7, background: "var(--gs-surface-strong)", borderRadius: 8, marginBottom: 8 }}>
            <div style={{ height: 7, width: `${currentRisk.bar}%`, background: `linear-gradient(90deg, var(--gs-accent), ${currentRisk.color})`, borderRadius: 8, transition: "width 900ms ease" }} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--gs-muted)" }}>{seasonLabel} | refreshed from API every 15 min</p>
        </div>

        <div className="grid-3" style={{ margin: "12px 0 12px" }}>
          {conditionCards.map((c, index) => (
            <div key={c.label} className="metric-card" style={{ animationDelay: `${0.04 * index}s` }}>
              <p style={{ margin: 0, fontSize: 11, color: "var(--gs-muted)", letterSpacing: "0.03em", fontWeight: 600 }}>{c.label}</p>
              <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: c.color }}>{c.value}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--gs-muted)" }}>{liveWeatherText}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Earned back this week", value: `INR ${currentEarned}`, color: "#1cc291", mono: false },
            { label: "Claims this week", value: `${currentClaims} auto-paid`, color: "#34a2ff", mono: false },
          ].map(s => (
            <div key={s.label} className="stats-card">
              <p style={{ margin: "0 0 6px", fontSize: 11, color: "var(--gs-muted)", lineHeight: 1.4 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: s.color, fontFamily: s.mono ? "'Sora', sans-serif" : "'Sora', sans-serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <p className="section-title">LIVE ZONE ALERTS</p>
        {dynamicAlerts.length === 0 && (
          <div style={{ fontSize: 12, color: "var(--gs-muted)", marginBottom: 10 }}>
            No live alerts available yet for this zone.
          </div>
        )}
        {dynamicAlerts.map((a, i) => (
          <div key={a.id} className="alert-card" style={{ borderLeft: `3px solid ${a.severity === "high" ? "#ff6363" : "#ffbe3d"}`, animationDelay: `${i * 0.07}s` }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", marginTop: 6, background: a.severity === "high" ? "#ff6363" : "#ffbe3d" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gs-text)" }}>{a.title}</span>
                  <span style={{ fontSize: 11, color: "var(--gs-muted)" }}>{a.time}</span>
                </div>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--gs-muted)" }}>{a.desc}</p>
              </div>
            </div>
          </div>
        ))}

        <p className="section-title" style={{ marginTop: 24 }}>RECENT PAYOUTS</p>
        {dynamicPayouts.length === 0 && (
          <div style={{ fontSize: 12, color: "var(--gs-muted)", marginBottom: 10 }}>
            No payout history available for this worker yet.
          </div>
        )}
        {dynamicPayouts.map(p => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--gs-border)" }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: "var(--gs-text)", fontWeight: 500 }}>{p.reason}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--gs-muted)" }}>{p.date}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1cc291", fontFamily: "'Sora', sans-serif" }}>+INR {p.amount}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#1cc291" }}>{p.status}</p>
            </div>
          </div>
        ))}
      </div>

      {loadingDashboard && (
        <div style={{ position: "fixed", top: 16, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 12, color: "var(--gs-muted)", background: "var(--gs-surface-strong)", border: "1px solid var(--gs-border)", borderRadius: 999, padding: "6px 10px" }}>
            Refreshing live dashboard...
          </div>
        </div>
      )}
    </div>
  );
}