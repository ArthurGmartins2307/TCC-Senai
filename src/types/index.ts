/**
 * Fato ou Farsa - Tipos e Interfaces do Sistema
 * Todos os textos e tipos em Português do Brasil (pt-BR)
 */

export type GeometryPreset =
  | 'ai_core'
  | 'evidence_net'
  | 'digital_sphere'
  | 'orbital_structure'
  | 'minimalist';

export interface SceneConfig {
  enabled: boolean;
  geometryPreset: GeometryPreset;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  particleDensity: number; // 50 to 1200
  networkDensity: number; // 10 to 100
  particleSpeed: number; // 0.1 to 3.0
  orbitalSpeed: number; // 0.1 to 3.0
  cameraDistance: number; // 8 to 35
  cameraIntensity: number; // 0.1 to 2.0
  lightingIntensity: number; // 0.2 to 2.5
  glowIntensity: number; // 0.1 to 2.0
  sceneRotation: boolean;
  animationSpeed: number; // 0.2 to 2.5
  bgOpacity: number; // 0 to 1
  interactiveIntensity: number; // 0 to 2
  quality: 'low' | 'medium' | 'high';
  sceneComplexity: 'minimal' | 'balanced' | 'rich';
}

export type ThemeMode = 'dark' | 'light' | 'auto';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  reducedMotion: boolean;
  cursorParallax: boolean;
  scrollAnimations: boolean;
  visualIntensity: number;
  decorativeTransparency: number;
  visualDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface InstagramProfile {
  username: string;
  fullName: string;
  avatarUrl: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  biography: string;
  category: string;
  profileUrl: string;
  joinedDate?: string;
}

export type PostFormat = 'reel' | 'image' | 'video' | 'carousel';

export interface InstagramPost {
  id: string;
  shortcode: string;
  type: PostFormat;
  caption: string;
  timestamp: string;
  formattedDate: string;
  viewsCount: number | null; // Null se indisponível
  likesCount: number | null; // Null se indisponível
  commentsCount: number | null; // Null se indisponível
  sharesCount: number | null; // Null se indisponível
  url: string;
  thumbnailUrl: string;
  isOutlier: boolean;
  anomalyScore: number; // 0 a 100
  suspicionFlags: string[];
  evidenceNotes?: string;
}

export interface StatisticalSummary {
  totalPostsAnalyzed: number;
  postsWithMetricsCount: number;
  postsWithMissingMetricsCount: number;
  avgViews: number | null;
  medianViews: number | null;
  minViews: number | null;
  maxViews: number | null;
  avgLikes: number | null;
  medianLikes: number | null;
  minLikes: number | null;
  maxLikes: number | null;
  avgComments: number | null;
  medianComments: number | null;
  likesToViewsRatio: number | null; // Porcentagem
  commentsToLikesRatio: number | null;
  engagementRate: number | null;
  outlierCount: number;
  outlierRatio: number; // Porcentagem
  suspiciousEngagementScore: number; // 0 a 100
  distributionInsight: string;
  sampleSizeWarning: string | null;
}

export type AIClassification =
  | 'Sem indícios relevantes identificados'
  | 'Indícios que merecem investigação'
  | 'Possível conteúdo enganoso'
  | 'Evidências consistentes de falsidade ou manipulação'
  | 'Dados insuficientes para concluir';

export interface AIAspectEvaluation {
  aspect: string;
  evaluation: string;
  status: 'normal' | 'alerta' | 'critico';
}

export interface AIAnalysisResult {
  classification: AIClassification;
  confidenceScore: number; // 0 a 100
  confidenceLevel: 'Baixa' | 'Média' | 'Alta';
  evidenceSummary: string;
  supportingObservations: string[];
  alternativeExplanations: string[];
  limitations: string[];
  recommendedNextSteps: string[];
  analyzedAspects: AIAspectEvaluation[];
  investigatedAt: string;
  modelUsed: string;
  requiresOfficialReport: boolean;
}

export interface InvestigationReport {
  id: string;
  createdAt: string;
  profile: InstagramProfile;
  posts: InstagramPost[];
  statistics: StatisticalSummary;
  aiAnalysis: AIAnalysisResult;
  isDemo: boolean;
  dataSource?: 'meta_graph_api' | 'sandbox_dataset' | 'manual_input';
  statusMessage?: string;
}

export interface VerifiedSource {
  name: string;
  title: string;
  url: string;
  quote?: string;
  isOfficialAgency: boolean;
}

export interface ClaimVerificationItem {
  id: string;
  claimText: string;
  category: 'Saúde' | 'Finanças' | 'Notícias' | 'Ciência' | 'Geral';
  verdict:
    | 'Falso'
    | 'Enganoso'
    | 'Sem Evidências Científicas'
    | 'Exagerado'
    | 'Fora de Contexto'
    | 'Verdadeiro / Respaldado';
  confidenceScore: number;
  evidenceSummary: string;
  scientificConsensus?: string;
  officialAlert?: string;
  sources: VerifiedSource[];
}

export interface FactCheckResult {
  textAnalyzed: string;
  topic: string;
  claims: ClaimVerificationItem[];
  overallRiskLevel: 'baixo' | 'moderado' | 'alto' | 'critico';
  engineUsed: string;
  investigatedAt: string;
}

export interface SystemStatus {
  system: string;
  version: string;
  environment: string;
  gemini: {
    configured: boolean;
    model: string;
    searchGroundingSupported: boolean;
    mode: 'active' | 'deterministic_fallback';
  };
  instagram: {
    configured: boolean;
    appIdConfigured: boolean;
    mode: 'meta_graph_api' | 'sandbox_curated';
    apiVersion: string;
    permissionsRequired: string[];
  };
  factCheckEngine: {
    status: string;
    sourcesCount: number;
    regulatoryAgencies: string[];
    factCheckingPartners: string[];
  };
}
