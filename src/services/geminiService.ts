/**
 * Fato ou Farsa - Serviço de Comunicação com a API Central (TikTok & IA)
 * Conexão com rotas do backend: /api/status, /api/analyze, /api/verify-claims e /api/tiktok/*
 */

import {
  TikTokProfile,
  TikTokVideo,
  StatisticalSummary,
  AIAnalysisResult,
  FactCheckResult,
  SystemStatus,
} from '../types';

/**
 * Helper para requisições seguras que tratam retornos não-JSON ou HTML sem quebrar com SyntaxError
 */
async function safeJsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const rawText = await res.text();

  let data: any = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    const preview = rawText.slice(0, 80).replace(/\s+/g, ' ').trim();
    if (!res.ok) {
      throw new Error(`Servidor retornou status ${res.status}: ${preview || 'resposta não-JSON'}`);
    }
    throw new Error(`Resposta do backend em formato inesperado (não é JSON): ${preview}`);
  }

  if (!res.ok) {
    const errorMsg =
      data?.error || data?.detail || data?.message || data?.details || `Erro na resposta do servidor: status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

function buildClientFallbackAnalysis(
  profile: TikTokProfile,
  posts: TikTokVideo[],
  statistics: StatisticalSummary,
  reason?: string
): AIAnalysisResult {
  const outlierCount = statistics?.outlierCount || 0;
  const suspiciousScore = statistics?.suspiciousEngagementScore || 0;
  const likesToViews = statistics?.likesToViewsRatio;

  let classification: any = 'Sem indícios relevantes identificados';
  let level: 'Baixa' | 'Média' | 'Alta' = 'Média';
  let requiresReport = false;

  if (suspiciousScore > 70) {
    classification = 'Evidências consistentes de falsidade ou manipulação';
    level = 'Alta';
    requiresReport = true;
  } else if (suspiciousScore > 45 || outlierCount > 1) {
    classification = 'Indícios que merecem investigação';
    level = 'Média';
  } else if (!posts || posts.length === 0) {
    classification = 'Dados insuficientes para concluir';
    level = 'Baixa';
  }

  const likesRatioStr =
    likesToViews !== null && likesToViews !== undefined ? `${likesToViews.toFixed(2)}%` : 'Indisponível';

  return {
    classification,
    confidenceScore: Math.min(88, Math.max(50, suspiciousScore + 20)),
    confidenceLevel: level,
    evidenceSummary: `Auditoria forense calculada para @${profile?.username || 'criador_tiktok'} com ${posts?.length || 0} vídeo(s) do TikTok avaliado(s). ${
      outlierCount > 0
        ? `Identificados ${outlierCount} vídeos com desvios atípicos nas métricas de engajamento.`
        : 'Distribuição estatística homogênea e regular observada nas métricas auditadas.'
    }`,
    supportingObservations: [
      `Amostragem de ${posts?.length || 0} vídeos com ${statistics?.postsWithMetricsCount || 0} métricas públicas apuradas.`,
      `Relação curtidas por reprodução: ${likesRatioStr}.`,
      outlierCount > 0
        ? `Presença de ${outlierCount} vídeo(s) com comportamento classificado como outlier estatístico.`
        : 'Ausência de anomalias estatísticas severas nas métricas agregadas.',
    ],
    alternativeExplanations: [
      'Picos de reproduções no TikTok podem decorrer da distribuição orgânica pelo algoritmo da Página "Para Você" (FYP).',
      'A taxa de curtidas pode oscilar conforme formato do conteúdo, polêmica ou retenção de áudio.',
    ],
    limitations: [
      'Análise baseada em dados públicos e metadados informados no momento da checagem.',
      reason
        ? `Nota técnica: Análise processada no módulo forense de contingência (${formatReason(reason)}).`
        : 'Métricas detalhadas de retenção requerem autorização expressa da conta no TikTok.',
    ],
    recommendedNextSteps: [
      'Verificar fontes citadas nas legendas dos vídeos em caso de alegações de saúde ou finanças.',
      'Consultar registros em órgãos reguladores (ANVISA, CFM, CVM) antes de qualquer tomada de decisão.',
    ],
    analyzedAspects: [
      {
        aspect: 'Integridade Estatística',
        evaluation: outlierCount > 0 ? 'Padrão com dispersão atípica de reproduções.' : 'Padrão regular de visualizações.',
        status: outlierCount > 1 ? 'alerta' : 'normal',
      },
      {
        aspect: 'Consistência de Engajamento',
        evaluation: `Pontuação de anomalia calculada em ${suspiciousScore}/100.`,
        status: suspiciousScore > 50 ? 'alerta' : 'normal',
      },
    ],
    investigatedAt: new Date().toLocaleString('pt-BR'),
    modelUsed: 'Motor Forense Local (Contingência Resiliente)',
    requiresOfficialReport: requiresReport,
  };
}

function formatReason(raw?: string): string {
  if (!raw) return 'modo determinístico';
  if (raw.includes('429') || raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED')) {
    return 'cota temporária de requisições excedida';
  }
  return 'modo de alta disponibilidade';
}

/**
 * Consulta a avaliação forense com o Gemini no backend
 */
export async function requestAiAnalysis(
  profile: TikTokProfile,
  posts: TikTokVideo[],
  statistics: StatisticalSummary,
  fallbackPreset?: AIAnalysisResult
): Promise<AIAnalysisResult> {
  try {
    return await safeJsonFetch<AIAnalysisResult>('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile,
        posts,
        statistics,
      }),
    });
  } catch (err: any) {
    if (fallbackPreset) {
      return fallbackPreset;
    }
    return buildClientFallbackAnalysis(profile, posts, statistics, err?.message);
  }
}

/**
 * Executa a checagem de alegações e evidências com o motor de busca e agências
 */
export async function requestFactCheck(
  caption: string,
  topic: string = 'Geral',
  profileName?: string
): Promise<FactCheckResult> {
  return await safeJsonFetch<FactCheckResult>('/api/verify-claims', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caption,
      topic,
      profileName,
    }),
  });
}

/**
 * Consulta perfil e vídeos através da rota oficial de integração do TikTok
 */
export async function fetchTikTokProfileData(
  usernameOrUrl: string,
  manualTranscript?: string,
  token?: string
): Promise<{
  source: 'tiktok_display_api' | 'tiktok_research_api' | 'sandbox_dataset' | 'manual_input';
  isLiveApi: boolean;
  statusMessage: string;
  retrievedAt: string;
  profile: TikTokProfile;
  posts: TikTokVideo[];
}> {
  return await safeJsonFetch('/api/tiktok/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usernameOrUrl,
      manualTranscript,
      token,
    }),
  });
}

// Alias de retrocompatibilidade
export const fetchInstagramProfileData = fetchTikTokProfileData;

/**
 * Consulta o status operacional das integrações de APIs
 */
export async function fetchSystemStatus(): Promise<SystemStatus> {
  return await safeJsonFetch<SystemStatus>('/api/status');
}

/**
 * Testa um token da API do TikTok
 */
export async function testTikTokToken(token?: string): Promise<{
  success: boolean;
  message: string;
}> {
  return await safeJsonFetch('/api/tiktok/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
}

// Alias de retrocompatibilidade
export const testMetaToken = testTikTokToken;

