/**
 * Fato ou Farsa - Testes de Extração de Alegações e Regras Forenses
 * Validação de lógica pura com o runner nativo node:test
 */

import test from 'node:test';
import assert from 'node:assert/strict';

export function extractFactualClaims(text) {
  if (!text || typeof text !== 'string') return [];
  // Segmentação por pontuação indicativa de afirmações completas
  const sentences = text
    .replace(/🚨|⚠️|🌿|💥|✅|❌/g, '')
    .split(/(?<=[.!?\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  // Palavras-chave indicativas de afirmações verificáveis
  const claimTriggers = [
    /cura|reverte|elimina|destr[oó]i|limpa/i,
    /descobert|revelad|estudo|pesquisa|m[eé]dico/i,
    /diabetes|c[aâ]ncer|art[eé]ria|glicose|press[aã]o/i,
    /lucro|rende|garantido|pix|dinheiro|invest/i,
    /urgente|censurad|segredo|escond/i,
    /100%|24\s*horas|48\s*horas|7\s*dias/i,
  ];

  return sentences.filter((sentence) =>
    claimTriggers.some((trigger) => trigger.test(sentence))
  );
}

export function classifyClaimVeracityHeuristic(claim) {
  const lower = claim.toLowerCase();

  // Falso: promessas de cura médica impossíveis ou milagres sem respaldo
  if (
    (lower.includes('diabetes') && (lower.includes('cura') || lower.includes('reverte em') || lower.includes('48 horas'))) ||
    (lower.includes('artéria') && lower.includes('limpa')) ||
    (lower.includes('lucro') && lower.includes('garantido') && (lower.includes('100%') || lower.includes('ao dia'))) ||
    (lower.includes('pix') && (lower.includes('multiplicar') || lower.includes('código secreto')))
  ) {
    return {
      verdict: 'Falso',
      confidence: 96,
      category: lower.includes('diabetes') || lower.includes('artéria') ? 'Saúde' : 'Finanças',
    };
  }

  // Enganoso / Exagerado
  if (
    (lower.includes('indústria farmacêutica') && (lower.includes('censurar') || lower.includes('derrubar') || lower.includes('esconder'))) ||
    lower.includes('querem censurar') ||
    lower.includes('médicos alemães descobrem')
  ) {
    return {
      verdict: 'Enganoso',
      confidence: 88,
      category: 'Geral',
    };
  }

  return {
    verdict: 'Sem Evidências Científicas',
    confidence: 70,
    category: 'Geral',
  };
}

test('extractFactualClaims identifica afirmações médicas e financeiras suspeitas', () => {
  const text = '🚨 URGENTE: Médicos alemães descobrem erva da Amazônia que destrói a glicose alta no sangue em 48 horas! A indústria farmacêutica quer censurar esse vídeo. Comente abaixo.';
  const claims = extractFactualClaims(text);
  assert.ok(claims.length >= 1, 'Deve extrair pelo menos uma alegação');
  assert.ok(claims[0].includes('glicose alta no sangue'));
});

test('classifyClaimVeracityHeuristic classifica corretamente alegações clássicas de desinformação', () => {
  const claimHealth = 'Erva da Amazônia que destrói a glicose alta e cura diabetes em 48 horas';
  const resultHealth = classifyClaimVeracityHeuristic(claimHealth);
  assert.equal(resultHealth.verdict, 'Falso');
  assert.equal(resultHealth.category, 'Saúde');
  assert.ok(resultHealth.confidence >= 90);

  const claimFinance = 'Robô de inteligência artificial que gera lucro garantido de 100% ao dia';
  const resultFinance = classifyClaimVeracityHeuristic(claimFinance);
  assert.equal(resultFinance.verdict, 'Falso');
  assert.equal(resultFinance.category, 'Finanças');

  const claimConspiracy = 'O que a indústria farmacêutica quer censurar e esconder da população';
  const resultConspiracy = classifyClaimVeracityHeuristic(claimConspiracy);
  assert.equal(resultConspiracy.verdict, 'Enganoso');
});
