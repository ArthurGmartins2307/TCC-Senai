/**
 * Fato ou Farsa - Adaptador de Compatibilidade
 * Reexporta os serviços normalizados para TikTok
 */

export * from './tiktokService';
export {
  fetchTikTokData as fetchInstagramProfileData,
  testTikTokConnection as testMetaConnection,
} from './tiktokService';
