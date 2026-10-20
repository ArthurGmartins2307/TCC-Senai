/**
 * Fato ou Farsa - Roteador Central de APIs
 * Gerencia as rotas /api/status, /api/instagram/*, /api/verify-claims e /api/analyze
 */

import { handleAiAnalysis } from './analyzeHandler';
import {
  testMetaConnection,
  fetchInstagramProfileData,
} from './instagramService';
import { verifyClaimsFromText } from './factCheckService';

export async function dispatchApiRoute(
  path: string,
  method: string,
  body: any,
  query: Record<string, string>
): Promise<{ status: number; data: any }> {
  // 1. GET /api/status
  if (path === '/api/status' && method === 'GET') {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
    const hasMetaToken = Boolean(process.env.INSTAGRAM_ACCESS_TOKEN);
    const hasMetaAppId = Boolean(process.env.INSTAGRAM_APP_ID);

    return {
      status: 200,
      data: {
        system: 'Fato ou Farsa API Gateway',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        gemini: {
          configured: hasGeminiKey,
          model: 'gemini-3.8-flash',
          searchGroundingSupported: true,
          mode: hasGeminiKey ? 'active' : 'deterministic_fallback',
        },
        instagram: {
          configured: hasMetaToken,
          appIdConfigured: hasMetaAppId,
          mode: hasMetaToken ? 'meta_graph_api' : 'sandbox_curated',
          apiVersion: 'v19.0',
          permissionsRequired: [
            'instagram_basic',
            'instagram_manage_insights',
            'pages_show_list',
          ],
        },
        factCheckEngine: {
          status: 'online',
          sourcesCount: 6,
          regulatoryAgencies: ['ANVISA', 'CFM', 'SBD', 'CVM', 'Banco Central'],
          factCheckingPartners: ['Agência Lupa', 'Aos Fatos', 'Projeto Comprova', 'G1 Fato ou Fake'],
        },
      },
    };
  }

  // 2. POST /api/instagram/test
  if (path === '/api/instagram/test' && method === 'POST') {
    const token = body?.token;
    const result = await testMetaConnection(token);
    return {
      status: result.success ? 200 : 400,
      data: result,
    };
  }

  // 3. POST /api/instagram/profile
  if (path === '/api/instagram/profile' && method === 'POST') {
    const username = body?.username || query?.username;
    if (!username) {
      return {
        status: 400,
        data: { error: 'O campo username ou url é obrigatório.' },
      };
    }
    const token = body?.token;
    const result = await fetchInstagramProfileData(username, token);
    return {
      status: 200,
      data: result,
    };
  }

  // 4. POST /api/verify-claims
  if (path === '/api/verify-claims' && method === 'POST') {
    const caption = body?.caption || body?.text;
    if (!caption) {
      return {
        status: 400,
        data: { error: 'O texto ou legenda para verificação é obrigatório.' },
      };
    }
    const topic = body?.topic || 'Geral';
    const profileName = body?.profileName;
    const result = await verifyClaimsFromText({ caption, topic, profileName });
    return {
      status: 200,
      data: result,
    };
  }

  // 5. POST /api/analyze (Análise forense completa de perfil)
  if (path === '/api/analyze' && method === 'POST') {
    const result = await handleAiAnalysis(body);
    return {
      status: 200,
      data: result,
    };
  }

  return {
    status: 404,
    data: { error: `Rota API não encontrada: ${method} ${path}` },
  };
}
