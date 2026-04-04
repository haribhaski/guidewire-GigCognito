import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

interface Proposal {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
  createdAt: string;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@500;700&display=swap');
  * { box-sizing: border-box; }
  .vote-page {
    min-height: 100vh;
    color: var(--gs-text);
    font-family: 'DM Sans', system-ui, sans-serif;
    padding-bottom: 96px;
  }
  .vote-wrap {
    max-width: 460px;
    margin: 0 auto;
    padding: 26px 18px 0;
  }
  .hero {
    border-radius: 18px;
    border: 1px solid var(--gs-border);
    background:
      radial-gradient(180px 90px at 92% 0%, rgba(93, 220, 255, 0.2), transparent 70%),
      var(--gs-surface);
    padding: 16px;
    margin-bottom: 14px;
    animation: riseIn 420ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .title {
    margin: 0;
    font-family: 'Sora', sans-serif;
    font-size: 23px;
    line-height: 1.2;
  }
  .sub {
    margin: 8px 0 0;
    font-size: 13px;
    color: var(--gs-muted);
    line-height: 1.55;
  }
  .form {
    border: 1px solid var(--gs-border);
    border-radius: 16px;
    background: var(--gs-surface);
    padding: 14px;
    margin-bottom: 16px;
    animation: riseIn 520ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--gs-muted);
    margin: 0 0 6px;
  }
  .input,
  .textarea {
    width: 100%;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface-strong);
    color: var(--gs-text);
    border-radius: 12px;
    padding: 12px;
    outline: none;
    transition: border-color 120ms ease;
    font-size: 14px;
  }
  .input:focus,
  .textarea:focus {
    border-color: var(--gs-accent);
  }
  .textarea { min-height: 98px; resize: vertical; }
  .btn {
    border: none;
    border-radius: 12px;
    padding: 12px 14px;
    font-weight: 700;
    cursor: pointer;
    background: linear-gradient(90deg, #1d90ff 0%, #4cd4ff 100%);
    color: #eaf6ff;
    width: 100%;
    margin-top: 10px;
    transition: transform 120ms ease;
    font-family: 'Sora', sans-serif;
  }
  .btn:hover { transform: translateY(-1px); }
  .status {
    margin-top: 10px;
    font-size: 13px;
    text-align: center;
  }
  .status.ok { color: #1cc291; }
  .status.err { color: #ff6c77; }
  .section {
    margin-top: 14px;
  }
  .section h3 {
    margin: 0 0 8px;
    font-size: 13px;
    letter-spacing: 0.08em;
    color: var(--gs-muted);
  }
  .card {
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 10px;
    animation: riseIn 430ms cubic-bezier(0.2, 0.7, 0, 1) both;
  }
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }
  .card-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: var(--gs-text);
  }
  .pill {
    border-radius: 999px;
    padding: 3px 9px;
    border: 1px solid rgba(104, 217, 255, 0.32);
    background: rgba(104, 217, 255, 0.13);
    color: #9ce7ff;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }
  .desc {
    margin: 6px 0 8px;
    color: var(--gs-muted);
    line-height: 1.55;
    font-size: 13px;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--gs-muted);
  }
  .vote-btn {
    margin-top: 10px;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface-strong);
    color: var(--gs-text);
    border-radius: 10px;
    padding: 9px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 120ms ease;
  }
  .vote-btn:hover { border-color: #b8ff1a; }
  .vote-btn:hover { border-color: #67dcff; }
  @keyframes riseIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function CommunityTriggersPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("gs_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/community-triggers/list`, { headers: { ...authHeaders() } })
      .then((res) => res.json())
      .then((data) => setProposals(Array.isArray(data) ? data : []))
      .catch(() => setProposals([]));
  }, []);

  const ranked = useMemo(() => [...proposals].sort((a, b) => b.votes - a.votes), [proposals]);

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/api/community-triggers/propose`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Proposal submitted successfully");
        setProposals((p) => [...p, data]);
        setTitle("");
        setDescription("");
      } else {
        setError(data.error || data.message || "Failed to submit proposal");
      }
    } catch {
      setError("Network error while submitting");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/api/community-triggers/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ proposalId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Vote recorded");
        setProposals((p) => p.map((item) => (item.id === id ? data : item)));
      } else {
        setError(data.error || data.message || "Vote failed");
      }
    } catch {
      setError("Network error while voting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-page">
      <style>{STYLES}</style>
      <div className="vote-wrap">
        <div className="hero">
          <h1 className="title">Community Trigger Voting</h1>
          <p className="sub">
            Propose new disruption signals and vote what should be covered next. Top ideas move to actuarial review.
          </p>
        </div>

        <form className="form" onSubmit={handlePropose}>
          <p className="label">TRIGGER TITLE</p>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Metro strike disruption"
            required
          />

          <p className="label" style={{ marginTop: 10 }}>DESCRIPTION</p>
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why this matters for your zone and earnings"
            required
          />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Proposal"}
          </button>

          {error && <div className="status err">{error}</div>}
          {success && <div className="status ok">{success}</div>}
        </form>

        <div className="section">
          <h3>TOP PROPOSALS</h3>
          {ranked.length === 0 && <div className="card">No proposals yet. Be the first to submit one.</div>}
          {ranked.map((proposal, idx) => (
            <div className="card" key={proposal.id} style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="card-head">
                <p className="card-title">{proposal.title}</p>
                <span className="pill">{proposal.status}</span>
              </div>
              <p className="desc">{proposal.description}</p>
              <div className="meta">
                <span>{proposal.votes} votes</span>
                <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
              </div>
              <button className="vote-btn" type="button" onClick={() => handleVote(proposal.id)} disabled={loading}>
                Upvote this trigger
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
