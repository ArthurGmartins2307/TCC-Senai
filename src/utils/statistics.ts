/**
 * Fato ou Farsa - Módulo de Análise Estatística Determinística
 * Cálculos matemáticos auditáveis em conformidade com as diretrizes forenses.
 */

import { InstagramPost, StatisticalSummary } from '../types';

/**
 * Formata números no padrão brasileiro (ex: 1.250.400)
 */
export function formatNumberBR(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'Não disponível';
  }
  return new Intl.NumberFormat('pt-BR').format(Math.round(num));
}

/**
 * Formata números abreviados no padrão brasileiro (ex: 1,2M ou 450K)
 */
export function formatCompactNumberBR(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/D';
  }
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'K';
  }
  return num.toString();
}

/**
 * Formata percentual no padrão brasileiro (ex: 4,85%)
 */
export function formatPercentBR(num: number | null | undefined, decimals = 2): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/D';
  }
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + '%';
}

/**
 * Formata data no padrão brasileiro
 */
export function formatDateBR(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calcula a mediana de uma lista numérica
 */
export function calculateMedian(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calcula a média aritmética de uma lista numérica
 */
export function calculateMean(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return sum / values.length;
}

/**
 * Identifica limites de outliers usando Intervalo Interquartil (IQR)
 */
export function calculateIQRLimits(values: number[]): { q1: number; q3: number; lowerLimit: number; upperLimit: number } | null {
  if (values.length < 4) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerLimit = Math.max(0, q1 - 1.5 * iqr);
  const upperLimit = q3 + 1.5 * iqr;
  return { q1, q3, lowerLimit, upperLimit };
}

/**
 * Executa a análise estatística completa sobre os posts coletados
 */
export function calculateStatisticalSummary(posts: InstagramPost[]): StatisticalSummary {
  const totalPostsAnalyzed = posts.length;

  const validViews = posts
    .map((p) => p.viewsCount)
    .filter((v): v is number => v !== null && v !== undefined && !isNaN(v));

  const validLikes = posts
    .map((p) => p.likesCount)
    .filter((l): l is number => l !== null && l !== undefined && !isNaN(l));

  const validComments = posts
    .map((p) => p.commentsCount)
    .filter((c): c is number => c !== null && c !== undefined && !isNaN(c));

  const postsWithMetricsCount = posts.filter(
    (p) => p.viewsCount !== null || p.likesCount !== null || p.commentsCount !== null
  ).length;

  const postsWithMissingMetricsCount = totalPostsAnalyzed - postsWithMetricsCount;

  const avgViews = calculateMean(validViews);
  const medianViews = calculateMedian(validViews);
  const minViews = validViews.length > 0 ? Math.min(...validViews) : null;
  const maxViews = validViews.length > 0 ? Math.max(...validViews) : null;

  const avgLikes = calculateMean(validLikes);
  const medianLikes = calculateMedian(validLikes);
  const minLikes = validLikes.length > 0 ? Math.min(...validLikes) : null;
  const maxLikes = validLikes.length > 0 ? Math.max(...validLikes) : null;

  const avgComments = calculateMean(validComments);
  const medianComments = calculateMedian(validComments);

  // Relação curtidas/visualizações (calculada sobre posts que possuem ambos os dados)
  const postsWithViewsAndLikes = posts.filter(
    (p) => p.viewsCount !== null && p.viewsCount > 0 && p.likesCount !== null
  );

  let likesToViewsRatio: number | null = null;
  if (postsWithViewsAndLikes.length > 0) {
    const totalV = postsWithViewsAndLikes.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
    const totalL = postsWithViewsAndLikes.reduce((acc, p) => acc + (p.likesCount || 0), 0);
    if (totalV > 0) {
      likesToViewsRatio = (totalL / totalV) * 100;
    }
  }

  // Relação comentários/curtidas
  let commentsToLikesRatio: number | null = null;
  if (validLikes.length > 0 && validComments.length > 0) {
    const sumLikes = validLikes.reduce((a, b) => a + b, 0);
    const sumComments = validComments.reduce((a, b) => a + b, 0);
    if (sumLikes > 0) {
      commentsToLikesRatio = (sumComments / sumLikes) * 100;
    }
  }

  // Identificação de Outliers estatísticos
  const viewsIQR = calculateIQRLimits(validViews);
  const likesIQR = calculateIQRLimits(validLikes);

  let outlierCount = 0;
  posts.forEach((post) => {
    let isOutlier = false;
    if (viewsIQR && post.viewsCount !== null) {
      if (post.viewsCount > viewsIQR.upperLimit || (viewsIQR.lowerLimit > 0 && post.viewsCount < viewsIQR.lowerLimit)) {
        isOutlier = true;
      }
    }
    if (likesIQR && post.likesCount !== null) {
      if (post.likesCount > likesIQR.upperLimit) {
        isOutlier = true;
      }
    }
    post.isOutlier = isOutlier;
    if (isOutlier) outlierCount++;
  });

  const outlierRatio = totalPostsAnalyzed > 0 ? (outlierCount / totalPostsAnalyzed) * 100 : 0;

  // Cálculo de pontuação de anomalia de engajamento (0 a 100)
  // Baseado na dispersão entre visualizações astronômicas e curtidas desproporcionais
  let suspiciousEngagementScore = 12; // Linha de base normal
  if (likesToViewsRatio !== null && likesToViewsRatio < 0.2 && (avgViews ?? 0) > 100_000) {
    // Proporção de curtidas anormalmente baixa para volume alto
    suspiciousEngagementScore += 45;
  }
  if (outlierRatio > 35) {
    suspiciousEngagementScore += 20;
  }
  if (postsWithMissingMetricsCount > totalPostsAnalyzed * 0.5) {
    suspiciousEngagementScore += 15;
  }
  suspiciousEngagementScore = Math.min(100, Math.max(0, suspiciousEngagementScore));

  let distributionInsight =
    'Distribuição regular de engajamento compatível com o comportamento orgânico da plataforma.';
  if (suspiciousEngagementScore > 60) {
    distributionInsight =
      'Discrepância acentuada entre picos de visualizações e taxa de conversão em curtidas ou comentários. Requer averiguação de tráfego artificial ou circulação externa.';
  } else if (outlierRatio > 25) {
    distributionInsight =
      'Presença de conteúdos com desempenho atípico (viralizações isoladas). Padrão comum em reels alavancados por algoritmos ou temas em alta.';
  }

  let sampleSizeWarning: string | null = null;
  if (totalPostsAnalyzed < 5) {
    sampleSizeWarning =
      'Amostragem reduzida: menos de 5 publicações disponíveis para cálculo. Os valores medianos possuem margem de incerteza elevada.';
  }

  // Taxa de engajamento geral média
  const engagementRate = likesToViewsRatio;

  return {
    totalPostsAnalyzed,
    postsWithMetricsCount,
    postsWithMissingMetricsCount,
    avgViews,
    medianViews,
    minViews,
    maxViews,
    avgLikes,
    medianLikes,
    minLikes,
    maxLikes,
    avgComments,
    medianComments,
    likesToViewsRatio,
    commentsToLikesRatio,
    engagementRate,
    outlierCount,
    outlierRatio,
    suspiciousEngagementScore,
    distributionInsight,
    sampleSizeWarning,
  };
}
