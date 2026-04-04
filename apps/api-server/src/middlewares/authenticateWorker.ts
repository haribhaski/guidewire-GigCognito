import { Request, Response, NextFunction } from "express";

// Dummy authentication middleware for worker (replace with real logic)
export function authenticateWorker(req: Request, res: Response, next: NextFunction) {
  // In production, extract worker ID from JWT or session
  // Here, we use a dummy worker for demonstration
  if (!req.user) {
    // Simulate a logged-in worker (for dev/testing)
    req.user = { id: "worker-demo-1", role: "worker" };
  }
  next();
}
