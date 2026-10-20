/**
 * Fato ou Farsa - Serviço de Comunicação com a API Central
 * Conexão com backend: /api/status, /api/analyze, /api/verify-claims e /api/instagram/*
 */

import {
  InstagramProfile,
  InstagramPost,
  StatisticalSummary,
  AIAnalysisResult,
  FactCheckResult,
  SystemStatus,
} from '../types';

/**
 * Consulta a avaliação forense com o Gemini no backend
 */
export async function requestAiAnalysis(
  profile: InstagramProfile,
  posts: InstagramPost[],
  statistics: StatisticalSummary,
  fallbackPreset?: AIAnalysisResult
): Promise<AIAnalysisResult> {
  try {
    const res = await fetch('/api/analyze', {
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

    if (!res.ok) {
      throw new Error(`Erro na resposta do servidor: status ${res.status}`);
    }

    const data = await res.json();
    return data as AIAnalysisResult;
  } catch (err) {
    console.warn('Erro ao solicitar análise da IA no servidor. Utilizando avaliação de segurança.', err);
    if (fallbackPreset) {
      return fallbackPreset;
    }
    throw err;
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
  const res = await fetch('/api/verify-claims', {
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

  if (!res.ok) {
    throw new Error(`Erro ao verificar evidências: status ${res.status}`);
  }

  return (await res.json()) as FactCheckResult;
}

/**
 * Consulta perfil e postagens através da rota oficial de integração
 */
export async function fetchInstagramProfileData(
  username: string,
  token?: string
): Promise<{
  source: 'meta_graph_api' | 'sandbox_dataset' | 'manual_input';
  isLiveApi: boolean;
  statusMessage: string;
  retrievedAt: string;
  profile: InstagramProfile;
  posts: InstagramPost[];
}> {
  const res = await fetch('/api/instagram/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      token,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Erro ao coletar dados do Instagram (${res.status})`);
  }

  return await res.json();
}

/**
 * Consulta o status operacional das integrações de APIs
 */
export async function fetchSystemStatus(): Promise<SystemStatus> {
  const res = await fetch('/api/status');
  if (!res.ok) {
    throw new Error('Falha ao obter status dos serviços.');
  }
  return (await res.json()) as SystemStatus;
}

/**
 * Testa um token da Meta Graph API
 */
export async function testMetaToken(token?: string): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch('/api/instagram/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  return await res.json();
}
