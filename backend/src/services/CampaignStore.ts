import { Campaign, SurfaceDefinition, LayoutVersion } from '../models/types';

export class CampaignStore {
  private campaigns: Map<string, Campaign> = new Map();
  private surfaces: Map<string, SurfaceDefinition> = new Map();
  private layoutVersions: LayoutVersion[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults(): void {
    const defaultCampaign: Campaign = {
      id: 'ev-pulse-2026',
      name: 'AURA EV Pulse - NextGen Mobility',
      assets: {
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        logoAspect: 2.5,
        productImageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
        productImageAspect: 1.5,
        focalPoint: { x: 0.52, y: 0.48 },
        headline: 'Experience the Future of Intelligent Electric Mobility',
        headlineCompact: 'The Future of Electric Mobility',
        headlineExtreme: 'Electric Mobility, Reimagined',
        description: 'Ultra-long range dynamic performance with zero emissions, autonomous highway glide, and hyper-fast 800V charging capability.',
        descriptionCompact: 'Ultra-long range with 800V hyper-fast charging.',
        descriptionExtreme: '800V Hyper-Fast Charging.',
        ctaText: 'Test Drive Now',
        legalText: '© 2026 AURA Motors Inc. Range based on EPA estimates. Terms apply.',
        brandColors: {
          primary: '#3B82F6',
          secondary: '#1E293B',
          background: '#0F172A',
          text: '#F8FAFC',
          accent: '#10B981',
        },
        fontFamily: 'Inter, sans-serif',
      },
      priorities: {
        headline: 'HIGH',
        product: 'HIGH',
        logo: 'HIGH',
        cta: 'HIGH',
        description: 'MEDIUM',
        legalText: 'LOW',
        decorative: 'LOW',
      },
      constraints: {
        minLogoWidth: 80,
        maxLogoWidth: 180,
        safeMargins: 16,
        ctaStyle: 'solid',
      },
      copyMode: 'exact',
      compressionLevel: 'Original',
    };

    this.campaigns.set(defaultCampaign.id, defaultCampaign);
  }

  public getCampaign(id: string): Campaign | undefined {
    return this.campaigns.get(id);
  }

  public getAllCampaigns(): Campaign[] {
    return Array.from(this.campaigns.values());
  }

  public saveCampaign(campaign: Campaign): Campaign {
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  public saveVersion(version: LayoutVersion): LayoutVersion {
    this.layoutVersions.unshift(version);
    return version;
  }

  public getVersions(campaignId?: string): LayoutVersion[] {
    if (campaignId) {
      return this.layoutVersions.filter((v) => v.campaignId === campaignId);
    }
    return this.layoutVersions;
  }
}
