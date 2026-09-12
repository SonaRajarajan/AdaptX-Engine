import { describe, it, expect } from 'vitest';
import { LayoutScoringEngine } from '../engine/scoring/LayoutScoringEngine';
import { CandidateGenerator } from '../engine/optimizer/CandidateGenerator';
import { DEFAULT_CAMPAIGN } from '../models/campaign';
import { SURFACE_PRESETS } from '../models/surface';

describe('LayoutScoringEngine', () => {
  it('should score candidates and produce 8-dimension breakdown', () => {
    const surface = SURFACE_PRESETS.desktop_leaderboard;
    const candidates = CandidateGenerator.generateCandidates(DEFAULT_CAMPAIGN, surface);

    const result = LayoutScoringEngine.scoreCandidate(candidates[0], DEFAULT_CAMPAIGN, surface);
    expect(result.breakdown.totalScore).toBeGreaterThan(50);
    expect(result.breakdown.readability).toBeGreaterThan(0);
    expect(result.breakdown.brandCompliance).toBeGreaterThan(0);
    expect(result.winReasons.length).toBeGreaterThan(0);
  });
});
