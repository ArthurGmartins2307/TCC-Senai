/**
 * Fato ou Farsa - Manipulador de Análise Forense com Google Gemini (Server-side)
 * Plataforma TikTok - Utiliza o SDK moderno @google/genai com o modelo gemini-3.8-flash
 */

import { GoogleGenAI, Type } from '@google/genai';

export async function handleAiAnalysis(payload: {
  profile: any;
  posts: any[];
  statistics: any;
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY não configurada no ambiente. Usando análise forense determinística interna.');
    return getFallbackDeterministicAnalysis(payload);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
Você é o motor forense de Inteligência Artificial do Fato ou Farsa, uma plataforma de verificação de conteúdos e vídeos do TikTok.
Sua missão é avaliar evidências numéricas, contextuais e semânticas de vídeos curtos de forma rigorosa, imparcial e em conformidade com as leis do Brasil (Marco Civil, LGPD, ANVISA, CVM).

DIRETRIZES CRÍTICAS:
1. Analise as evidências. Explique a incerteza. NUNCA invente uma conclusão.
2. Mantenha estrita distinção entre:
   - Padrões incomuns de engajamento no TikTok (views altos com poucas curtidas refletem entrega algorítmica da FYP ou rejeição, não provam má-fé por si sós).
   - Conteúdo potencialmente enganoso (promessas de enriquecimento rápido, robôs de Pix, curas milagrosas em 48h, desinformação eleitoral/social).
   - Evidências suficientes para justificar investigação adicional ou consulta a órgãos oficiais.
3. Responda ESTRITAMENTE em Português do Brasil (pt-BR).
4. A classificação DEVE ser OBRIGATORIAMENTE uma destas 5 frases exatas:
   - "Sem indícios relevantes identificados"
   - "Indícios que merecem investigação"
   - "Possível conteúdo enganoso"
   - "Evidências consistentes de falsidade ou manipulação"
   - "Dados insuficientes para concluir"
`;

    const userPrompt = `
Investigue este criador e vídeos do TikTok:
Perfil:
- Usuário: @${payload.profile?.username} (${payload.profile?.fullName})
- Bio: "${payload.profile?.biography}"
- Categoria: ${payload.profile?.category}
- Seguidores: ${payload.profile?.followersCount} | Verificado no TikTok: ${payload.profile?.isVerified ? 'Sim' : 'Não'}

Resumo Estatístico Calculado:
- Total de Vídeos Analisados: ${payload.statistics?.totalPostsAnalyzed}
- Média de Plays (Views): ${payload.statistics?.avgViews ?? 'N/D'} | Mediana: ${payload.statistics?.medianViews ?? 'N/D'}
- Relação Curtidas / Views: ${payload.statistics?.likesToViewsRatio ? payload.statistics.likesToViewsRatio.toFixed(2) + '%' : 'N/D'}
- Outliers Detectados: ${payload.statistics?.outlierCount}
- Pontuação de Anomalia de Engajamento: ${payload.statistics?.suspiciousEngagementScore}/100

Amostra de Vídeos do TikTok:
${payload.posts
  .slice(0, 8)
  .map(
    (p, i) =>
      `[Vídeo ${i + 1}] Formato: ${p.type} | Plays: ${p.viewsCount ?? 'N/D'} | Curtidas: ${p.likesCount ?? 'N/D'} | Outlier: ${p.isOutlier ? 'SIM' : 'NÃO'}
Legenda: "${p.caption}"
${p.transcript ? `Transcrição/Áudio: "${p.transcript}"` : ''}
${p.soundTitle ? `Som: "${p.soundTitle}"` : ''}`
  )
  .join('\n\n')}

Avalie com rigor forense e retorne o JSON estruturado.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: {
              type: Type.STRING,
              description:
                'Uma das 5 classificações exatas em português brasileiro permitidas.',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Pontuação de 0 a 100 indicando o grau de evidência disponível.',
            },
            confidenceLevel: {
              type: Type.STRING,
              description: 'Baixa, Média ou Alta',
            },
            evidenceSummary: {
              type: Type.STRING,
              description: 'Síntese forense concisa em português do Brasil.',
            },
            supportingObservations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Principais evidências e fatos verificáveis observados.',
            },
            alternativeExplanations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Hipóteses benignas que justificam o padrão observado.',
            },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'O que não pôde ser verificado ou dados indisponíveis.',
            },
            recommendedNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Ações recomendadas para o cidadão ou analista.',
            },
            analyzedAspects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  aspect: { type: Type.STRING },
                  evaluation: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'normal, alerta ou critico' },
                },
                required: ['aspect', 'evaluation', 'status'],
              },
            },
            requiresOfficialReport: {
              type: Type.BOOLEAN,
              description: 'True se houver suspeita grave justificando encaminhamento para denúncia.',
            },
          },
          required: [
            'classification',
            'confidenceScore',
            'confidenceLevel',
            'evidenceSummary',
            'supportingObservations',
            'alternativeExplanations',
            'limitations',
            'recommendedNextSteps',
            'analyzedAspects',
            'requiresOfficialReport',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      ...parsed,
      investigatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      modelUsed: 'gemini-3.8-flash (TikTok Verification Engine)',
    };
  } catch (err: any) {
    console.error('Erro na chamada ao Gemini API:', err);
    return getFallbackDeterministicAnalysis(payload, err?.message);
  }
}

/**
 * Análise determinística de segurança quando o Gemini estiver offline ou com quota 429
 */
function getFallbackDeterministicAnalysis(payload: any, errorDetail?: string) {
  const stats = payload.statistics || {};
  const posts = payload.posts || [];
  const outlierCount = stats.outlierCount || 0;
  const suspiciousScore = stats.suspiciousEngagementScore || 0;

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
  }

  return {
    classification,
    confidenceScore: Math.min(85, Math.max(50, suspiciousScore + 20)),
    confidenceLevel: level,
    evidenceSummary: `Análise determinística concluída com ${posts.length} vídeos do TikTok avaliados. ${
      outlierCount > 0
        ? `Identificados ${outlierCount} vídeos com desvios expressivos entre visualizações e taxa de curtidas.`
        : 'Distribuição homogênea observada nas métricas dos vídeos auditados.'
    }`,
    supportingObservations: [
      `Amostragem de ${posts.length} vídeos do TikTok com ${stats.postsWithMetricsCount || 0} métricas calculadas.`,
      `Taxa de curtidas em relação a reproduções: ${stats.likesToViewsRatio ? stats.likesToViewsRatio.toFixed(2) + '%' : 'Indisponível'}.`,
      outlierCount > 0
        ? `Presença de ${outlierCount} vídeo(s) classificado(s) como outlier estatístico via IQR.`
        : 'Ausência de anomalias estatísticas severas nas métricas públicas.',
    ],
    alternativeExplanations: [
      'Picos de reproduções no TikTok podem decorrer da dinâmica natural da página "Para Você" (FYP) ou compartilhamento viral externo.',
      'A taxa de curtidas pode variar expressivamente dependendo do nicho e do formato da narrativa.',
    ],
    limitations: [
      'Análise baseada em dados públicos e metadados informados no momento da checagem.',
      errorDetail ? `Nota técnica: Análise processada localmente (${errorDetail}).` : 'Métricas detalhadas de retenção requerem autorização expressa do titular da conta no TikTok.',
    ],
    recommendedNextSteps: [
      'Avaliar fontes e referências citadas nas legendas dos vídeos marcados como alerta.',
      'Consultar a base de órgãos reguladores (ANVISA, CVM, CFM) antes de tomar decisões.',
    ],
    analyzedAspects: [
      {
        aspect: 'Integridade Estatística',
        evaluation: outlierCount > 0 ? 'Padrão com dispersão atípica de reproduções.' : 'Padrão estável.',
        status: outlierCount > 1 ? 'alerta' : 'normal',
      },
      {
        aspect: 'Consistência de Engajamento',
        evaluation: `Pontuação de anomalia calculada em ${suspiciousScore}/100.`,
        status: suspiciousScore > 50 ? 'alerta' : 'normal',
      },
    ],
    investigatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    modelUsed: 'Fato ou Farsa Deterministic Engine (Local Fallback)',
    requiresOfficialReport: requiresReport,
  };
}
