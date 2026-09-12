import { LayoutCandidate, EvaluationResult, ConflictReport } from '../../models/layout';
import { SurfaceDefinition } from '../../models/surface';

export class DecisionExplainer {
  /**
   * Generates a comprehensive, human-readable explainability report for a set of evaluated candidates.
   */
  public static generateExplanation(
    winningCandidate: LayoutCandidate,
    candidates: LayoutCandidate[],
    surface: SurfaceDefinition,
    conflictReport: ConflictReport
  ): string {
    const lines: string[] = [];

    lines.push(`WINNING LAYOUT: ${winningCandidate.strategyName} — Score: ${winningCandidate.score.totalScore}/100`);
    lines.push(`Surface Context: ${surface.name} (${surface.width}x${surface.height}px, ${surface.orientation}, ${surface.viewingDistance}m viewing distance)`);
    lines.push('');
    lines.push('Key Strengths & Decision Rationales:');
    winningCandidate.winReasons.forEach((reason) => {
      lines.push(`  - ${reason}`);
    });

    if (winningCandidate.penalties.length > 0) {
      lines.push('');
      lines.push('Minor Trade-offs / Penalties:');
      winningCandidate.penalties.forEach((pen) => {
        lines.push(`  - ${pen}`);
      });
    }

    lines.push('');
    lines.push('Rejected Alternative Candidates:');
    candidates
      .filter((c) => c.id !== winningCandidate.id)
      .forEach((rejected) => {
        lines.push(`  • ${rejected.strategyName} (Score: ${rejected.score.totalScore}/100)`);
        if (rejected.penalties.length > 0) {
          lines.push(`    - Primary Rejection Reason: ${rejected.penalties[0]}`);
        }
      });

    if (conflictReport.hasConflict) {
      lines.push('');
      lines.push('IMPOSSIBLE CONSTRAINT CONFLICT DETECTED:');
      conflictReport.messages.forEach((msg) => lines.push(`  - ${msg}`));
      lines.push('Recommended Actions:');
      conflictReport.suggestedActions.forEach((act) => lines.push(`  - ${act}`));
    }

    return lines.join('\n');
  }

  /**
   * Analyzes candidate set for impossible constraint combinations (Explainable Failure State).
   */
  public static analyzeConflicts(
    candidates: LayoutCandidate[],
    surface: SurfaceDefinition
  ): ConflictReport {
    const messages: string[] = [];
    const suggestedActions: string[] = [];

    // Check if all candidates failed or scored under 50
    const bestScore = Math.max(...candidates.map((c) => c.score.totalScore));

    if (bestScore < 50 || surface.width < 120 || surface.height < 100) {
      messages.push(`Available surface dimensions (${surface.width}x${surface.height}px) are too small to fit mandatory HIGH priority elements.`);
      suggestedActions.push('Enable Adaptive Copy Mode to compress headline and description text.');
      suggestedActions.push('Relax logo minimum width constraint below 70px.');
      suggestedActions.push('Increase container height or switch orientation.');
    }

    return {
      hasConflict: messages.length > 0,
      messages,
      suggestedActions,
    };
  }
}
