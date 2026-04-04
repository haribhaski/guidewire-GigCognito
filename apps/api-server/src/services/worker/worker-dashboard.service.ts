// Worker Transparency Dashboard Service
// Returns real-time trigger data, payout pool status, and worker risk signals
import { getCurrentTriggers } from "../trigger/trigger-poller.service";
import { getPayoutPoolStatus } from "../payout/payout.service";
import { getWorkerRiskSignals } from "../fraud/fraud-score.service";

export async function getWorkerDashboard(workerId: string, zoneId: string) {
  // Real-time trigger data for worker's zone
  const triggers = await getCurrentTriggers(zoneId);
  // Payout pool status (anonymized)
  const payoutPool = await getPayoutPoolStatus(zoneId);
  // Latest risk/fraud signals for this worker
  const riskSignals = await getWorkerRiskSignals(workerId);
  return {
    triggers,
    payoutPool,
    riskSignals,
  };
}
