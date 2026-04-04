import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');
  * { box-sizing: border-box; }
  :root[data-theme='dark'] {
    --gs-bg: #090f1f;
    --gs-surface: rgba(255, 255, 255, 0.05);
    --gs-surface-strong: rgba(255, 255, 255, 0.09);
    --gs-border: rgba(255, 255, 255, 0.1);
    --gs-text: #eaf2ff;
    --gs-muted: rgba(234, 242, 255, 0.56);
    --gs-accent: #34a2ff;
    --gs-nav-bg: rgba(7, 13, 29, 0.9);
  }
  :root[data-theme='light'] {
    --gs-bg: #f6f9ff;
    --gs-surface: rgba(255, 255, 255, 0.94);
    --gs-surface-strong: rgba(255, 255, 255, 1);
    --gs-border: rgba(0, 34, 73, 0.14);
    --gs-text: #0d1d33;
    --gs-muted: rgba(13, 29, 51, 0.56);
    --gs-accent: #0b79d0;
    --gs-nav-bg: rgba(245, 250, 255, 0.93);
  }
  body {
    margin: 0;
    background: var(--gs-bg);
    color: var(--gs-text);
    transition: background 260ms ease, color 260ms ease;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .app-shell {
    min-height: 100vh;
    padding-bottom: 80px;
    background:
      linear-gradient(rgba(93, 220, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(93, 220, 255, 0.05) 1px, transparent 1px),
      radial-gradient(900px 480px at -10% -20%, rgba(52, 162, 255, 0.16), transparent 56%),
      radial-gradient(600px 360px at 110% 0%, rgba(90, 208, 255, 0.15), transparent 58%),
      var(--gs-bg);
    background-size: 44px 44px, 44px 44px, auto, auto, auto;
  }
  .nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border-radius: 10px;
    color: var(--gs-muted);
    transition: background 170ms ease, color 170ms ease, transform 170ms ease;
  }
  .nav-btn:hover {
    background: var(--gs-surface);
    transform: translateY(-1px);
  }
  .nav-btn.active {
    color: var(--gs-accent);
    background: var(--gs-surface);
  }
  .theme-toggle {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 99;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface-strong);
    color: var(--gs-text);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: transform 160ms ease;
  }
  .theme-toggle:hover {
    transform: translateY(-1px);
  }
`;

const NAV = [
  { id: "home", label: "Home", path: "/dashboard" },
  { id: "policy", label: "Policy", path: "/policy" },
  { id: "claims", label: "Claims", path: "/claims" },
  { id: "vote", label: "Vote", path: "/community-triggers" },
  { id: "transparency", label: "Live", path: "/transparency-dashboard" },
];

function NavGlyph({ id }: { id: string }) {
  if (id === "home") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "policy") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3 19 6v6c0 4.8-2.8 7.7-7 9-4.2-1.3-7-4.2-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "claims") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "vote") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 10h8M8 14h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("gs_theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("gs_theme", theme);
  }, [theme]);

  const nextTheme = useMemo(() => (theme === "dark" ? "light" : "dark"), [theme]);

  return (
    <div className="app-shell">
      <style>{STYLES}</style>
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme(nextTheme)}
        aria-label={`Switch to ${nextTheme} mode`}
      >
        <span>{theme === "dark" ? "Dark" : "Light"}</span>
        <span>{theme === "dark" ? "Sun" : "Moon"}</span>
      </button>
      <div style={{ minHeight: "calc(100vh - 60px)" }}>{children}</div>
      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--gs-nav-bg)", backdropFilter: "blur(14px)", borderTop: "1px solid var(--gs-border)", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 50 }}>
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-btn ${location.pathname === n.path ? "active" : ""}`}
            onClick={() => navigate(n.path)}
          >
            <NavGlyph id={n.id} />
            <span style={{ fontSize: 11, fontWeight: location.pathname === n.path ? 700 : 500 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
