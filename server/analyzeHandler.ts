/**
 * Fato ou Farsa - Manipulador de Análise com Google Gemini (Server-side)
 * Utiliza o SDK moderno @google/genai com o modelo gemini-3.8-flash
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
Você é o motor forense de Inteligência Artificial do Fato ou Farsa, uma plataforma de verificação de perfis e conteúdos do Instagram.
Sua missão é avaliar evidências numéricas, contextuais e semânticas de forma rigorosa, imparcial e em conformidade com as leis do Brasil (Marco Civil, LGPD, ANVISA, CVM).

DIRETRIZES CRÍTICAS:
1. Analise as evidências. Explique a incerteza. NUNCA invente uma conclusão.
2. Mantenha estrita distinção entre:
   - Padrões incomuns de engajamento (views altos com poucos likes não provam fraude).
   - Conteúdo potencialmente enganoso (promessas financeiras surreais, curas milagrosas).
   - Evidências suficientes para justificar investigação adicional.
3. Responda ESTRITAMENTE em Português do Brasil (pt-BR).
4. A classificação DEVE ser OBRIGATORIAMENTE uma destas 5 frases exatas:
   - "Sem indícios relevantes identificados"
   - "Indícios que merecem investigação"
   - "Possível conteúdo enganoso"
   - "Evidências consistentes de falsidade ou manipulação"
   - "Dados insuficientes para concluir"
`;

    const userPrompt = `
Investigue este perfil e postagens do Instagram:
Perfil:
- Usuário: @${payload.profile?.username} (${payload.profile?.fullName})
- Bio: "${payload.profile?.biography}"
- Categoria: ${payload.profile?.category}
- Seguidores: ${payload.profile?.followersCount} | Verificado: ${payload.profile?.isVerified ? 'Sim' : 'Não'}

Resumo Estatístico Calculado:
- Total de Posts Analisados: ${payload.statistics?.totalPostsAnalyzed}
- Média de Views: ${payload.statistics?.avgViews ?? 'N/D'} | Mediana de Views: ${payload.statistics?.medianViews ?? 'N/D'}
- Relação Curtidas / Views: ${payload.statistics?.likesToViewsRatio ? payload.statistics.likesToViewsRatio.toFixed(2) + '%' : 'N/D'}
- Outliers Detectados: ${payload.statistics?.outlierCount}
- Pontuação de Anomalia de Engajamento: ${payload.statistics?.suspiciousEngagementScore}/100

Amostra de Postagens:
${payload.posts
  .slice(0, 8)
  .map(
    (p, i) =>
      `[Post ${i + 1}] Tipo: ${p.type} | Views: ${p.viewsCount ?? 'N/D'} | Likes: ${p.likesCount ?? 'N/D'} | Outlier: ${p.isOutlier ? 'SIM' : 'NÃO'}\nLegenda: "${p.caption}"`
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
              description: 'Observações específicas que suportam a avaliação.',
            },
            alternativeExplanations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Hipóteses benignas ou alternativas para os dados encontrados.',
            },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Limitações inerentes à análise de dados públicos.',
            },
            recommendedNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Próximos passos recomendados ao investigador ou usuário.',
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
              description: 'Se há justificativa sólida para denúncia aos canais oficiais.',
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
      modelUsed: 'gemini-3.8-flash (Fato ou Farsa Forensic Engine)',
    };
  } catch (err: any) {
    console.error('Erro na chamada ao Gemini API:', err);
    return getFallbackDeterministicAnalysis(payload, err?.message);
  }
}

/**
 * Análise determinística de segurança quando o Gemini estiver offline ou indisponível
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
    evidenceSummary: `Análise estatística determinística concluída com ${posts.length} postagens avaliadas. ${
      outlierCount > 0
        ? `Identificados ${outlierCount} conteúdos com desvios expressivos de distribuição métrica.`
        : 'Distribuição homogênea observada nas publicações analisadas.'
    }`,
    supportingObservations: [
      `Amostragem de ${posts.length} publicações com ${stats.postsWithMetricsCount || 0} métricas válidas.`,
      `Taxa de curtidas em relação a reproduções: ${stats.likesToViewsRatio ? stats.likesToViewsRatio.toFixed(2) + '%' : 'Indisponível'}.`,
      outlierCount > 0
        ? `Presença de ${outlierCount} post(s) classificado(s) como outlier estatístico via IQR.`
        : 'Ausência de anomalias estatísticas severas nas métricas públicas.',
    ],
    alternativeExplanations: [
      'Picos de visualização podem decorrer de compartilhamento externo em aplicativos de mensagens ou circulação nos algoritmos de descoberta da Meta.',
      'A ausência de contadores de visualização em carrosséis e fotos é comportamento padrão da interface pública do Instagram.',
    ],
    limitations: [
      'Análise baseada em dados públicos de amostragem no momento da checagem.',
      errorDetail ? `Nota técnica: Análise processada localmente (${errorDetail}).` : 'Métricas privadas não auditáveis sem autorização expressa do titular.',
    ],
    recommendedNextSteps: [
      'Avaliar fontes citadas nas legendas dos conteúdos marcados como anomalia.',
      'Consultar ferramentas de checagem adicionais antes de qualquer conclusão.',
    ],
    analyzedAspects: [
      {
        aspect: 'Integridade Estatística',
        evaluation: outlierCount > 0 ? 'Padrão com dispersão atípica.' : 'Padrão estável.',
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
