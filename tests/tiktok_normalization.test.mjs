/**
 * Fato ou Farsa - Testes Unitários de Normalização de Dados do TikTok
 * Utiliza o executor nativo node:test em conformidade com o Ultra Mode.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// Funções puras de normalização do TikTok
export function sanitizeTikTokInput(input) {
  if (!input || typeof input !== 'string') return '';
  let clean = input.trim();
  // Remove protocolo e domínio se for URL
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?tiktok\.com\//i, '');
  // Remove query strings e barras finais
  clean = clean.split('?')[0].replace(/\/+$/, '');
  // Se for link de vídeo: @usuario/video/123456789
  const matchVideo = clean.match(/^@?([^/]+)\/video\/(\d+)/i);
  if (matchVideo) {
    return {
      type: 'video',
      username: matchVideo[1].toLowerCase(),
      videoId: matchVideo[2],
    };
  }
  // Remove prefixo @
  clean = clean.replace(/^@/, '');
  return {
    type: 'profile',
    username: clean.toLowerCase(),
  };
}

export function normalizeTikTokMetricValue(val) {
  if (val === null || val === undefined) return null;
  const num = Number(val);
  if (isNaN(num)) return null;
  return Math.max(0, Math.round(num));
}

export function normalizeTikTokVideoItem(item) {
  const viewsCount = normalizeTikTokMetricValue(item.view_count ?? item.viewsCount);
  const likesCount = normalizeTikTokMetricValue(item.like_count ?? item.likesCount);
  const commentsCount = normalizeTikTokMetricValue(item.comment_count ?? item.commentsCount);
  const sharesCount = normalizeTikTokMetricValue(item.share_count ?? item.sharesCount);

  return {
    id: item.id || 'video_unknown',
    caption: item.video_description || item.caption || '',
    viewsCount,
    likesCount,
    commentsCount,
    sharesCount,
  };
}

export function computeEngagementRatio(likes, views) {
  if (views === null || views === 0 || likes === null) return null;
  return (likes / views) * 100;
}

// BATERIA DE TESTES
test('sanitizeTikTokInput normaliza URLs de vídeos do TikTok', () => {
  const result = sanitizeTikTokInput('https://www.tiktok.com/@saude_vital/video/7378291048192019482?is_from_webapp=1');
  assert.equal(result.type, 'video');
  assert.equal(result.username, 'saude_vital');
  assert.equal(result.videoId, '7378291048192019482');
});

test('sanitizeTikTokInput normaliza URLs de perfis do TikTok', () => {
  const result = sanitizeTikTokInput('https://tiktok.com/@dra_mariana_nutricao/');
  assert.equal(result.type, 'profile');
  assert.equal(result.username, 'dra_mariana_nutricao');
});

test('sanitizeTikTokInput normaliza usernames com @', () => {
  const result = sanitizeTikTokInput('@tech_investimentos');
  assert.equal(result.type, 'profile');
  assert.equal(result.username, 'tech_investimentos');
});

test('normalizeTikTokMetricValue distingue rigorosamente 0 de null', () => {
  assert.equal(normalizeTikTokMetricValue(0), 0);
  assert.equal(normalizeTikTokMetricValue('0'), 0);
  assert.equal(normalizeTikTokMetricValue(null), null);
  assert.equal(normalizeTikTokMetricValue(undefined), null);
  assert.equal(normalizeTikTokMetricValue(1500), 1500);
});

test('normalizeTikTokVideoItem normaliza campos de métricas do TikTok', () => {
  const rawItem = {
    id: '7378291048192019482',
    video_description: 'Vídeo sobre saúde no TikTok #saude',
    view_count: 2840000,
    like_count: 1420,
    comment_count: 9400,
    share_count: 12400,
  };

  const normalized = normalizeTikTokVideoItem(rawItem);
  assert.equal(normalized.id, '7378291048192019482');
  assert.equal(normalized.viewsCount, 2840000);
  assert.equal(normalized.likesCount, 1420);
  assert.equal(normalized.commentsCount, 9400);
  assert.equal(normalized.sharesCount, 12400);
});

test('computeEngagementRatio calcula taxa percentual de curtidas por visualização', () => {
  // 1.420 curtidas em 2.840.000 views = 0.05%
  const ratio = computeEngagementRatio(1420, 2840000);
  assert.ok(ratio !== null);
  assert.equal(ratio.toFixed(2), '0.05');

  // Valores ausentes resultam em null
  assert.equal(computeEngagementRatio(null, 1000), null);
  assert.equal(computeEngagementRatio(50, null), null);
  assert.equal(computeEngagementRatio(50, 0), null);
});
