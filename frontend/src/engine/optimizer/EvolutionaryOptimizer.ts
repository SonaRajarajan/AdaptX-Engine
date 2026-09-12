import { LayoutGenome, LayoutCandidate, ElementGenome } from '../../models/layout';
import { Campaign } from '../../models/campaign';
import { SurfaceDefinition } from '../../models/surface';
import { ConstraintSolver } from '../constraints/ConstraintSolver';
import { LayoutScoringEngine } from '../scoring/LayoutScoringEngine';

export class EvolutionaryOptimizer {
  /**
   * Performs genetic evolutionary optimization over N generations
   * to refine element positioning, scaling, and gaps for a candidate layout.
   */
  public static optimize(
    initialCandidate: LayoutCandidate,
    campaign: Campaign,
    surface: SurfaceDefinition,
    generations = 12,
    populationSize = 8
  ): LayoutCandidate {
    let currentBest = initialCandidate;

    for (let gen = 0; gen < generations; gen++) {
      const population: LayoutGenome[] = [currentBest.genome];

      // Generate mutants
      for (let p = 1; p < populationSize; p++) {
        population.push(this.mutateGenome(currentBest.genome, surface));
      }

      // Score population
      for (const candidateGenome of population) {
        const constraintCheck = ConstraintSolver.solveAndValidate(candidateGenome, surface, campaign.priorities);
        if (!constraintCheck.isValid && constraintCheck.violations.length > 2) {
          continue; // Skip invalid genomes
        }

        const scoring = LayoutScoringEngine.scoreCandidate(constraintCheck.genome, campaign, surface);

        if (scoring.breakdown.totalScore > currentBest.score.totalScore) {
          currentBest = {
            id: currentBest.id,
            strategyName: `${initialCandidate.strategyName} (Evolving Gen ${gen + 1})`,
            genome: constraintCheck.genome,
            score: scoring.breakdown,
            winReasons: [...scoring.winReasons, `Optimized via evolutionary search (Gen ${gen + 1}).`],
            penalties: scoring.penalties,
          };
        }
      }
    }

    return currentBest;
  }

  private static mutateGenome(genome: LayoutGenome, surface: SurfaceDefinition): LayoutGenome {
    const clone: LayoutGenome = JSON.parse(JSON.stringify(genome));
    const W = surface.width;
    const H = surface.height;

    // Pick 1 or 2 elements to perturb randomly
    const keys = Object.keys(clone.elements) as (keyof typeof clone.elements)[];
    const keyToMutate = keys[Math.floor(Math.random() * keys.length)];
    const el = clone.elements[keyToMutate] as ElementGenome;

    if (el && el.visible) {
      const deltaX = Math.round((Math.random() - 0.5) * 16);
      const deltaY = Math.round((Math.random() - 0.5) * 16);
      const deltaScale = (Math.random() - 0.5) * 0.1;

      el.box.x = Math.max(0, Math.min(W - el.box.width, el.box.x + deltaX));
      el.box.y = Math.max(0, Math.min(H - el.box.height, el.box.y + deltaY));
      el.scale = Math.max(0.7, Math.min(1.4, el.scale + deltaScale));
    }

    // Mutate gap/padding slightly
    clone.gap = Math.max(8, Math.min(32, clone.gap + Math.round((Math.random() - 0.5) * 4)));
    return clone;
  }
}
