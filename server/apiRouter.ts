/**
 * Fato ou Farsa - Roteador Central de APIs (Plataforma TikTok)
 * Gerencia as rotas /api/status, /api/tiktok/*, /api/verify-claims e /api/analyze
 */

import { handleAiAnalysis } from './analyzeHandler';
import {
  testTikTokConnection,
  fetchTikTokData,
} from './tiktokService';
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
    const hasTikTokToken = Boolean(process.env.TIKTOK_ACCESS_TOKEN);
    const hasTikTokKey = Boolean(process.env.TIKTOK_CLIENT_KEY);

    return {
      status: 200,
      data: {
        system: 'Fato ou Farsa API Gateway',
        version: '3.0.0',
        platform: 'TikTok',
        environment: process.env.NODE_ENV || 'development',
        gemini: {
          configured: hasGeminiKey,
          model: 'gemini-3.8-flash',
          searchGroundingSupported: true,
          mode: hasGeminiKey ? 'active' : 'deterministic_fallback',
        },
        tiktok: {
          configured: hasTikTokToken,
          clientKeyConfigured: hasTikTokKey,
          mode: hasTikTokToken ? 'tiktok_display_api' : 'sandbox_curated',
          apiVersion: 'v2',
          permissionsRequired: [
            'user.info.basic',
            'user.info.profile',
            'user.info.stats',
            'video.list',
          ],
          researchApiEligible: false,
        },
        factCheckEngine: {
          status: 'online',
          sourcesCount: 8,
          regulatoryAgencies: ['ANVISA', 'CFM', 'SBD', 'CVM', 'Banco Central'],
          factCheckingPartners: ['Agência Lupa', 'Aos Fatos', 'Projeto Comprova', 'G1 Fato ou Fake', 'Estadão Verifica'],
        },
      },
    };
  }

  // 2. POST /api/tiktok/test
  if ((path === '/api/tiktok/test' || path === '/api/instagram/test') && method === 'POST') {
    const token = body?.token;
    const result = await testTikTokConnection(token);
    return {
      status: result.success ? 200 : 400,
      data: result,
    };
  }

  // 3. POST /api/tiktok/profile
  if ((path === '/api/tiktok/profile' || path === '/api/instagram/profile') && method === 'POST') {
    const usernameOrUrl = body?.usernameOrUrl || body?.username || query?.usernameOrUrl || query?.username;
    if (!usernameOrUrl && !body?.manualTranscript) {
      return {
        status: 400,
        data: { error: 'O link de vídeo do TikTok, @usuário ou transcrição manual é obrigatório.' },
      };
    }
    const token = body?.token;
    const manualTranscript = body?.manualTranscript;
    const result = await fetchTikTokData(usernameOrUrl || '@video_tiktok', manualTranscript, token);
    return {
      status: 200,
      data: result,
    };
  }

  // 4. POST /api/verify-claims
  if (path === '/api/verify-claims' && method === 'POST') {
    const caption = body?.caption || body?.text || body?.transcript;
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

  // 5. POST /api/analyze (Análise forense completa de perfil / vídeo)
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
