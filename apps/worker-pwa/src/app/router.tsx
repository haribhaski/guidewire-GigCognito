import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "../pages/Onboarding/Onboarding";
import StartPage from "../pages/Start/StartPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import Policy from "../pages/Policy/Policy";
import Claims from "../pages/Claims/Claims";
import CommunityTriggersPage from "../pages/CommunityTriggers/CommunityTriggersPage";
import TransparencyDashboardPage from "../pages/TransparencyDashboard/TransparencyDashboardPage";
import AppShell from "./AppShell";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<AppShell> <Dashboard /> </AppShell>} path="/dashboard" />
      <Route element={<AppShell> <Policy /> </AppShell>} path="/policy" />
      <Route element={<AppShell> <Claims /> </AppShell>} path="/claims" />
      <Route element={<AppShell> <CommunityTriggersPage /> </AppShell>} path="/community-triggers" />
      <Route element={<AppShell> <TransparencyDashboardPage /> </AppShell>} path="/transparency-dashboard" />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}