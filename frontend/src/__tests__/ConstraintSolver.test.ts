import { describe, it, expect } from 'vitest';
import { ConstraintSolver } from '../engine/constraints/ConstraintSolver';
import { CandidateGenerator } from '../engine/optimizer/CandidateGenerator';
import { DEFAULT_CAMPAIGN } from '../models/campaign';
import { SURFACE_PRESETS } from '../models/surface';

describe('ConstraintSolver Engine', () => {
  it('should validate default desktop candidate layout', () => {
    const surface = SURFACE_PRESETS.desktop_leaderboard;
    const candidates = CandidateGenerator.generateCandidates(DEFAULT_CAMPAIGN, surface);
    expect(candidates.length).toBe(5);

    const result = ConstraintSolver.solveAndValidate(candidates[0], surface, DEFAULT_CAMPAIGN.priorities);
    expect(result.genome).toBeDefined();
    expect(result.isValid).toBe(true);
  });

  it('should perform 4-tier degradation on tiny smartwatch screen', () => {
    const surface = SURFACE_PRESETS.wearable_smartwatch;
    const candidates = CandidateGenerator.generateCandidates(DEFAULT_CAMPAIGN, surface);
    const result = ConstraintSolver.solveAndValidate(candidates[0], surface, DEFAULT_CAMPAIGN.priorities);

    expect(result.degradationLog.length).toBeGreaterThan(0);
    expect(result.genome.elements.decorative?.visible).toBe(false);
  });
});
