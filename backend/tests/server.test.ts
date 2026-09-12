import { describe, it, expect } from 'vitest';
import { CampaignStore } from '../src/services/CampaignStore';
import { LayoutEngineService } from '../src/services/LayoutEngineService';

describe('ADAPT-X Backend Services', () => {
  it('should initialize default campaign correctly', () => {
    const store = new CampaignStore();
    const campaign = store.getCampaign('ev-pulse-2026');
    expect(campaign).toBeDefined();
    expect(campaign?.assets.headline).toContain('Future of Intelligent Electric Mobility');
    expect(campaign?.priorities.product).toBe('HIGH');
  });

  it('should perform semantic text compression', () => {
    const headline = 'Experience the Future of Intelligent Electric Mobility';
    const desc = 'Ultra-long range dynamic performance with zero emissions and hyper-fast charging.';
    const result = LayoutEngineService.compressText(headline, desc);

    expect(result.compact.headline).toBeDefined();
    expect(result.compact.headline.length).toBeLessThan(headline.length);
    expect(result.extreme.headline.split(' ').length).toBeLessThanOrEqual(4);
  });
});
