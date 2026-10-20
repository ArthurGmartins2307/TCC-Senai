/**
 * Fato ou Farsa - Modal de Checagem Factual Baseada em Evidências
 * Apresenta o resultado da checagem de alegações, fontes verificadas e alertas regulatórios
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  FileCheck,
  Scale,
  Building2,
  Sparkles,
} from 'lucide-react';
import { InstagramPost, FactCheckResult, ClaimVerificationItem } from '../../types';
import { requestFactCheck } from '../../services/geminiService';

interface FactCheckModalProps {
  post: InstagramPost | null;
  customText?: string;
  topic?: string;
  profileName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FactCheckModal({
  post,
  customText,
  topic = 'Geral',
  profileName,
  isOpen,
  onClose,
}: FactCheckModalProps) {
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const textToVerify = post?.caption || customText || '';

  useEffect(() => {
    if (isOpen && textToVerify) {
      runVerification();
    }
  }, [isOpen, textToVerify]);

  const runVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestFactCheck(textToVerify, topic, profileName);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao executar checagem forense.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictBadge = (verdict: ClaimVerificationItem['verdict']) => {
    switch (verdict) {
      case 'Falso':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900">
            <ShieldAlert className="w-3.5 h-3.5" />
            FALSO
          </span>
        );
      case 'Enganoso':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertTriangle className="w-3.5 h-3.5" />
            ENGANOSO
          </span>
        );
      case 'Sem Evidências Científicas':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900">
            <HelpCircle className="w-3.5 h-3.5" />
            SEM EVIDÊNCIAS
          </span>
        );
      case 'Verdadeiro / Respaldado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <ShieldCheck className="w-3.5 h-3.5" />
            VERDADEIRO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {verdict}
          </span>
        );
    }
  };

  const copyDossier = () => {
    if (!result) return;
    const reportText = `[FATO OU FARSA - LAUDO DE CHECAGEM FACTUAL]
Data da Auditoria: ${result.investigatedAt}
Motor Utilizado: ${result.engineUsed}
Texto Analisado: "${result.textAnalyzed}"

ALEGAÇÕES VERIFICADAS:
${result.claims
  .map(
    (c, i) => `
${i + 1}. Afirmação: "${c.claimText}"
   Veredicto: ${c.verdict} (Grau de Confiança: ${c.confidenceScore}%)
   Síntese: ${c.evidenceSummary}
   ${c.officialAlert ? `Alerta Oficial: ${c.officialAlert}` : ''}
   Fontes: ${c.sources.map((s) => `${s.name} (${s.url})`).join(' | ')}
`
  )
  .join('\n')}

Relatório emitido pela plataforma Fato ou Farsa.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fact-check-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="fact-check-modal-title" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Verificação de Evidências e Fatos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cruzamento com agências de checagem e bases regulatórias (ANVISA, CFM, CVM)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal de checagem"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
          {/* Postagem em análise */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Conteúdo sob Investigação
              </span>
              {post && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium uppercase">
                  {post.type}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 italic line-clamp-3">
              "{textToVerify}"
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Cruzando afirmações com registros oficiais e agências de checagem...
              </p>
            </div>
          )}

          {/* Erro */}
          {error && !loading && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 text-xs">
              <p className="font-bold">Não foi possível concluir a checagem</p>
              <p className="mt-1">{error}</p>
              <button
                onClick={runVerification}
                className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Resultado */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Metadados da checagem */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs">
                <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300">
                  <Sparkles className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>Motor de Auditoria:</strong> {result.engineUsed}
                  </span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {result.investigatedAt}
                </span>
              </div>

              {/* Alegações */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Alegações Factuais Extraídas &amp; Veredicto
                </h3>

                {result.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Categoria: {claim.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          "{claim.claimText}"
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVerdictBadge(claim.verdict)}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {claim.confidenceScore}% Confiança
                        </span>
                      </div>
                    </div>

                    {/* Síntese forense */}
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        Síntese de Evidências:
                      </p>
                      <p>{claim.evidenceSummary}</p>
                    </div>

                    {/* Alerta de órgão regulador se houver */}
                    {claim.officialAlert && (
                      <div className="text-xs bg-red-50 dark:bg-red-950/40 p-3.5 rounded-lg border border-red-200 dark:border-red-900 text-red-900 dark:text-red-300 flex items-start gap-2.5">
                        <Building2 className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-bold text-[11px] uppercase tracking-wide">Posicionamento Regulatório Oficial</p>
                          <p className="mt-0.5 leading-relaxed">{claim.officialAlert}</p>
                        </div>
                      </div>
                    )}

                    {/* Fontes consultadas */}
                    {claim.sources.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Fontes Verificadas &amp; Desmentidos
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {claim.sources.map((source, sIdx) => (
                            <a
                              key={sIdx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-900/40 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex-1 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                                    {source.name}
                                  </span>
                                  {source.isOfficialAgency && (
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                                      Órgão Oficial
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {source.title}
                                </p>
                                {source.quote && (
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                                    "{source.quote}"
                                  </p>
                                )}
                              </div>
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={copyDossier}
            disabled={!result || loading}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado para Área de Transferência' : 'Copiar Laudo'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
