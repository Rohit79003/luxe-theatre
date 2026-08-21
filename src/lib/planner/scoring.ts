export interface PackageCandidate {
  theaterBasePrice: number;
  maxCapacity: number;
  guests: number;
  totalCost: number;
  budget: number;
  addOnCount: number;
  hasPreferredCategories: boolean;
}

export function calculateCandidateScore(candidate: PackageCandidate): number {
  // 1. Capacity score: Highest when theater capacity closely matches guest count without overflowing
  const capacityRatio = candidate.guests / candidate.maxCapacity;
  // ideal ratio is 0.5 - 0.8
  const capacityScore = Math.max(0, 100 - Math.abs(0.7 - capacityRatio) * 100);

  // 2. Budget score: Penalize if over budget (0 score), reward getting maximum value within budget
  if (candidate.totalCost > candidate.budget) {
    return 0;
  }
  const budgetUtilization = candidate.totalCost / candidate.budget;
  const budgetScore = budgetUtilization * 100;

  // 3. Relevance & AddOn score
  const addOnScore = candidate.addOnCount * 25;
  const relevanceBonus = candidate.hasPreferredCategories ? 50 : 0;

  return Math.round(capacityScore * 0.3 + budgetScore * 0.4 + addOnScore * 0.15 + relevanceBonus * 0.15);
}
