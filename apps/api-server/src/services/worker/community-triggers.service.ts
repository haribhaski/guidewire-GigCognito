// Community Voting for New Triggers Service
// Workers can propose and vote on new parametric triggers
import { v4 as uuidv4 } from "uuid";

const proposals: Record<string, any> = {};
const votes: Record<string, Set<string>> = {};

export function proposeTrigger(workerId: string, title: string, description: string) {
  const id = uuidv4();
  proposals[id] = {
    id,
    title,
    description,
    proposer: workerId,
    votes: 1,
    voters: new Set([workerId]),
    status: "UNDER_REVIEW",
    createdAt: new Date().toISOString(),
  };
  votes[id] = new Set([workerId]);
  return proposals[id];
}

export function voteTrigger(workerId: string, proposalId: string) {
  if (!proposals[proposalId]) throw new Error("Proposal not found");
  if (votes[proposalId].has(workerId)) throw new Error("Already voted");
  votes[proposalId].add(workerId);
  proposals[proposalId].votes = votes[proposalId].size;
  proposals[proposalId].voters = votes[proposalId];
  return proposals[proposalId];
}

export function listProposals() {
  return Object.values(proposals).map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    votes: p.votes,
    status: p.status,
    createdAt: p.createdAt,
  }));
}
