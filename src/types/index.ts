/**
 * Fato ou Farsa - Tipos e Interfaces do Sistema (Plataforma de Verificação TikTok)
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
  particleDensity: number;
  networkDensity: number;
  particleSpeed: number;
  orbitalSpeed: number;
  cameraDistance: number;
  cameraIntensity: number;
  lightingIntensity: number;
  glowIntensity: number;
  sceneRotation: boolean;
  animationSpeed: number;
  bgOpacity: number;
  interactiveIntensity: number;
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

export interface TikTokProfile {
  username: string;
  fullName: string;
  avatarUrl: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  likesReceivedCount?: number; // Total de curtidas recebidas no perfil
  videosCount: number;
  biography: string;
  category: string;
  profileUrl: string;
  joinedDate?: string;
}

// Compatibilidade de tipo
export type InstagramProfile = TikTokProfile;

export type VideoFormat = 'video' | 'photo_carousel' | 'livestream_clip';
export type PostFormat = VideoFormat;

export interface TikTokVideo {
  id: string;
  videoId?: string;
  shortcode?: string;
  type: VideoFormat;
  caption: string; // Legenda do TikTok
  transcript?: string; // Transcrição de áudio / narração
  soundTitle?: string; // Título do som / áudio original ou comercial
  timestamp: string;
  formattedDate: string;
  viewsCount: number | null; // Reproduções / Plays
  likesCount: number | null; // Curtidas / Diggs
  commentsCount: number | null; // Comentários
  sharesCount: number | null; // Compartilhamentos
  savesCount?: number | null; // Salvamentos / Favoritos
  durationSeconds?: number | null; // Duração do vídeo
  url: string;
  thumbnailUrl: string;
  isOutlier: boolean;
  anomalyScore: number; // 0 a 100
  suspicionFlags: string[];
  evidenceNotes?: string;
}

// Compatibilidade de tipo
export type InstagramPost = TikTokVideo;

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
  likesToViewsRatio: number | null; // Porcentagem de curtidas por visualização
  commentsToLikesRatio: number | null;
  engagementRate: number | null;
  outlierCount: number;
  outlierRatio: number;
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
  confidenceScore: number;
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
  profile: TikTokProfile;
  posts: TikTokVideo[];
  statistics: StatisticalSummary;
  aiAnalysis: AIAnalysisResult;
  isDemo: boolean;
  dataSource?: 'tiktok_display_api' | 'tiktok_research_api' | 'sandbox_dataset' | 'manual_input';
  statusMessage?: string;
  submittedUrl?: string;
  submittedTranscript?: string;
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
  platform: 'TikTok';
  environment: string;
  gemini: {
    configured: boolean;
    model: string;
    searchGroundingSupported: boolean;
    mode: 'active' | 'deterministic_fallback';
  };
  tiktok: {
    configured: boolean;
    clientKeyConfigured: boolean;
    mode: 'tiktok_display_api' | 'sandbox_curated';
    apiVersion: string;
    permissionsRequired: string[];
    researchApiEligible: boolean;
  };
  factCheckEngine: {
    status: string;
    sourcesCount: number;
    regulatoryAgencies: string[];
    factCheckingPartners: string[];
  };
}
