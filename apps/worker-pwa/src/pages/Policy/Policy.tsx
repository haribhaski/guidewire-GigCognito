import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type PolicyTrigger = {
  type: string;
  icon: string;
  label: string;
  desc: string;
  active: boolean;
};

type PolicyOverview = {
  workerName: string;
  hasPolicy: boolean;
  message?: string;
  weekLabel?: string;
  plan?: string;
  weeklyPremium?: number;
  zone?: string;
  maxDailyPayout?: number;
  maxWeeklyPayout?: number;
  validTill?: string;
  claimEligibility?: string;
  payoutMethod?: string;
  coveredTriggers?: PolicyTrigger[];
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@600;700&display=swap');
  * { box-sizing: border-box; }
  .policy-page {
    min-height: 100vh;
    color: var(--gs-text);
    font-family: 'DM Sans', system-ui, sans-serif;
    padding-bottom: 96px;
  }
  .wrap { max-width: 460px; margin: 0 auto; padding: 24px 18px 0; }
  .hero {
    border: 1px solid var(--gs-border);
    border-radius: 18px;
    background:
      radial-gradient(240px 120px at 92% -10%, rgba(83, 206, 255, 0.23), transparent 72%),
      var(--gs-surface);
    padding: 16px;
    animation: riseIn .45s cubic-bezier(.2,.7,0,1) both;
  }
  .hero h1 { margin: 0; font-family: 'Sora', sans-serif; font-size: 24px; }
  .hero p { margin: 8px 0 0; color: var(--gs-muted); font-size: 13px; }
  .badge {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border-radius: 999px;
    padding: 6px 10px;
    border: 1px solid rgba(67, 201, 255, 0.38);
    background: rgba(67, 201, 255, 0.12);
    color: #98e8ff;
    font-size: 12px;
    font-weight: 700;
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #55d7ff;
    box-shadow: 0 0 0 0 #55d7ff;
    animation: pulse 1.8s infinite;
  }
  .plan {
    margin-top: 12px;
    border-radius: 16px;
    border: 1px solid rgba(77, 199, 255, 0.36);
    background: linear-gradient(160deg, rgba(13, 28, 44, 0.8), rgba(8, 20, 36, 0.75));
    padding: 14px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--gs-border);
    padding: 8px 0;
    gap: 10px;
  }
  .row:last-child { border-bottom: none; }
  .k { color: var(--gs-muted); font-size: 12px; }
  .v { color: var(--gs-text); font-size: 13px; font-weight: 600; text-align: right; }
  .section-title {
    margin: 18px 0 8px;
    color: var(--gs-muted);
    letter-spacing: .08em;
    font-size: 12px;
    font-weight: 700;
  }
  .trigger {
    border-radius: 12px;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    padding: 11px;
    margin-bottom: 8px;
    animation: riseIn .45s cubic-bezier(.2,.7,0,1) both;
  }
  .trigger-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .trigger h4 { margin: 0; font-size: 14px; }
  .trigger p { margin: 4px 0 0; color: var(--gs-muted); font-size: 12px; line-height: 1.45; }
  .state {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid rgba(67, 201, 255, 0.4);
    color: #98e8ff;
    background: rgba(67, 201, 255, 0.12);
    white-space: nowrap;
  }
  .cta {
    margin-top: 14px;
    border: none;
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: linear-gradient(90deg, #1a8eff 0%, #52d7ff 100%);
    color: #eaf6ff;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
  }
  @keyframes riseIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 70% { box-shadow: 0 0 0 8px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
`;

export default function Policy() {
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policy, setPolicy] = useState<PolicyOverview | null>(null);

  useEffect(() => {
    async function loadPolicy() {
      setLoading(true);
      setError(null);
      setRecovering(false);

      try {
        const token = localStorage.getItem("gs_token");

        const getPolicy = async (): Promise<PolicyOverview> => {
          const res = await fetch(`${API_BASE}/policy/me`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || `Policy request failed (${res.status})`);
          }

          return (await res.json()) as PolicyOverview;
        };

        let data = await getPolicy();

        if (token && !data.hasPolicy) {
          setRecovering(true);
          const repairRes = await fetch(`${API_BASE}/policy/create-or-renew`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tier: "standard" }),
          });

          if (repairRes.ok) {
            data = await getPolicy();
          }
        }

        setPolicy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load policy");
      } finally {
        setRecovering(false);
        setLoading(false);
      }
    }

    loadPolicy();
  }, []);

  if (loading) {
    return <div className="policy-page"><style>{STYLES}</style><div className="wrap">{recovering ? "Creating policy..." : "Loading policy..."}</div></div>;
  }

  if (error) {
    return <div className="policy-page"><style>{STYLES}</style><div className="wrap">{error}</div></div>;
  }

  if (!policy?.hasPolicy) {
    return <div className="policy-page"><style>{STYLES}</style><div className="wrap">{policy?.message || "No active policy found"}</div></div>;
  }

  const triggers = policy.coveredTriggers || [];
  const validTill = policy.validTill ? new Date(policy.validTill).toLocaleDateString() : "--";

  return (
    <div className="policy-page">
      <style>{STYLES}</style>
      <div className="wrap">
        <div className="hero">
          <h1>Policy Coverage</h1>
          <p>Member: {policy.workerName || "Worker"} | {policy.weekLabel || "Current weekly cycle"}</p>
          <div className="badge"><span className="dot" /> ACTIVE</div>

          <div className="plan">
            <div className="row"><span className="k">Plan</span><span className="v">{policy.plan || "Standard"}</span></div>
            <div className="row"><span className="k">Weekly Premium</span><span className="v">INR {policy.weeklyPremium ?? 0}</span></div>
            <div className="row"><span className="k">Zone</span><span className="v">{policy.zone || "--"}</span></div>
            <div className="row"><span className="k">Max Daily Payout</span><span className="v">INR {policy.maxDailyPayout ?? 0}</span></div>
            <div className="row"><span className="k">Max Weekly Payout</span><span className="v">INR {policy.maxWeeklyPayout ?? 0}</span></div>
            <div className="row"><span className="k">Valid Till</span><span className="v">{validTill}</span></div>
            <div className="row"><span className="k">Payout Method</span><span className="v">{policy.payoutMethod || "UPI"}</span></div>
          </div>
        </div>

        <p className="section-title">COVERED TRIGGERS</p>
        {triggers.map((trigger, index) => (
          <div key={`${trigger.type}-${index}`} className="trigger" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="trigger-head">
              <h4>{trigger.label}</h4>
              <span className="state">{trigger.active ? "Active" : "Monitoring"}</span>
            </div>
            <p>{trigger.desc}</p>
          </div>
        ))}

        <button className="cta" type="button">Renew Next Week</button>
      </div>
    </div>
  );
}
