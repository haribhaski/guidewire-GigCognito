import express from "express";
import { getWorkerDashboard } from "../services/worker/worker-dashboard.service";
import { authenticateWorker } from "../middlewares/authenticateWorker";

const router = express.Router();

// GET /api/worker/dashboard
router.get("/dashboard", authenticateWorker, async (req, res) => {
  const workerId = req.user.id;
  const zoneId = req.user.zoneId;
  try {
    const dashboard = await getWorkerDashboard(workerId, zoneId);
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

export default router;
