import express from "express";
import { proposeTrigger, voteTrigger, listProposals } from "../services/worker/community-triggers.service";
import { authenticateWorker } from "../middlewares/authenticateWorker";

const router = express.Router();

// POST /api/community-triggers/propose
router.post("/propose", authenticateWorker, (req, res) => {
  const workerId = req.user.id;
  const { title, description } = req.body;
  try {
    const proposal = proposeTrigger(workerId, title, description);
    res.json(proposal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/community-triggers/vote
router.post("/vote", authenticateWorker, (req, res) => {
  const workerId = req.user.id;
  const { proposalId } = req.body;
  try {
    const proposal = voteTrigger(workerId, proposalId);
    res.json(proposal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/community-triggers/list
router.get("/list", authenticateWorker, (req, res) => {
  res.json(listProposals());
});

export default router;
