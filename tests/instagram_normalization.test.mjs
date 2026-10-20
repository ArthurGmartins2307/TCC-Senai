/**
 * Fato ou Farsa - Testes Unitários de Normalização de Dados do Instagram
 * Utiliza o executor nativo node:test em conformidade com o Ultra Mode.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// Funções puras de normalização a serem testadas
export function sanitizeInstagramInput(input) {
  if (!input || typeof input !== 'string') return '';
  let clean = input.trim();
  // Remove protocolo e domínio se for URL
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, '');
  // Remove query strings e barras finais
  clean = clean.split('?')[0].replace(/\/+$/, '');
  // Remove /p/ ou /reel/ se for link de post
  clean = clean.replace(/^(?:p|reel|tv)\/([^/]+)/i, '$1');
  // Remove prefixo @
  clean = clean.replace(/^@/, '');
  return clean.toLowerCase();
}

export function normalizeMetaGraphMediaItem(item) {
  const isVideo = item.media_type === 'VIDEO';
  const isCarousel = item.media_type === 'CAROUSEL_ALBUM';

  // Distinção crítica: null !== 0
  // Fotos e carrosséis não possuem contador de reproduções público na API
  let viewsCount = null;
  if (isVideo) {
    if (typeof item.video_views === 'number') {
      viewsCount = item.video_views;
    } else if (typeof item.insights?.video_views === 'number') {
      viewsCount = item.insights.video_views;
    } else if (typeof item.views_count === 'number') {
      viewsCount = item.views_count;
    } else {
      viewsCount = 0; // Vídeo com 0 reproduções reais
    }
  }

  // Curtidas: se a contagem foi ocultada pelo autor, a API omite ou retorna null
  let likesCount = null;
  if (typeof item.like_count === 'number') {
    likesCount = item.like_count;
  } else if (typeof item.likes_count === 'number') {
    likesCount = item.likes_count;
  }

  // Comentários
  let commentsCount = null;
  if (typeof item.comments_count === 'number') {
    commentsCount = item.comments_count;
  }

  const type = isVideo
    ? (item.is_reel || item.caption?.toLowerCase().includes('#reels') ? 'reel' : 'video')
    : isCarousel
    ? 'carousel'
    : 'image';

  return {
    id: item.id || `post_${Date.now()}`,
    shortcode: item.shortcode || item.id || '',
    type,
    caption: item.caption || '',
    timestamp: item.timestamp || new Date().toISOString(),
    viewsCount,
    likesCount,
    commentsCount,
    dataSource: item.data_source || 'meta_graph_api',
  };
}

test('sanitizeInstagramInput normaliza URLs e arrobas corretamente', () => {
  assert.equal(sanitizeInstagramInput('@saude_vital'), 'saude_vital');
  assert.equal(sanitizeInstagramInput('https://www.instagram.com/dra_mariana/'), 'dra_mariana');
  assert.equal(sanitizeInstagramInput('instagram.com/tech_investimentos?igsh=abc'), 'tech_investimentos');
  assert.equal(sanitizeInstagramInput('  @noticias_urgente  '), 'noticias_urgente');
  assert.equal(sanitizeInstagramInput(''), '');
});

test('normalizeMetaGraphMediaItem preserva null para visualizações em imagens e carrosséis', () => {
  const imageItem = {
    id: '123',
    media_type: 'IMAGE',
    like_count: 450,
    caption: 'Foto de alimentação saudável',
  };
  const normalized = normalizeMetaGraphMediaItem(imageItem);
  assert.equal(normalized.type, 'image');
  assert.equal(normalized.viewsCount, null, 'Imagens estáticas devem ter viewsCount como null');
  assert.equal(normalized.likesCount, 450);

  const carouselItem = {
    id: '456',
    media_type: 'CAROUSEL_ALBUM',
    like_count: 1200,
    caption: 'Carrossel explicativo',
  };
  const normCarousel = normalizeMetaGraphMediaItem(carouselItem);
  assert.equal(normCarousel.type, 'carousel');
  assert.equal(normCarousel.viewsCount, null, 'Carrossel deve ter viewsCount como null');
});

test('normalizeMetaGraphMediaItem extrai visualizações para vídeos e reels', () => {
  const videoItem = {
    id: '789',
    media_type: 'VIDEO',
    video_views: 185000,
    like_count: 120,
    caption: 'Reel com dica milagrosa #reels',
  };
  const normalized = normalizeMetaGraphMediaItem(videoItem);
  assert.equal(normalized.type, 'reel');
  assert.equal(normalized.viewsCount, 185000);
  assert.equal(normalized.likesCount, 120);
});

test('normalizeMetaGraphMediaItem trata contagem de curtidas oculta como null', () => {
  const hiddenLikesItem = {
    id: '999',
    media_type: 'VIDEO',
    video_views: 50000,
    caption: 'Postagem com curtidas ocultadas pelo autor',
  };
  const normalized = normalizeMetaGraphMediaItem(hiddenLikesItem);
  assert.equal(normalized.likesCount, null, 'Curtidas ausentes devem ser tratadas como null');
  assert.equal(normalized.viewsCount, 50000);
});
