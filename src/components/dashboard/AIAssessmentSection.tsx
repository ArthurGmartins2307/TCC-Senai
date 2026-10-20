/**
 * Fato ou Farsa - Seção D: Resultado da Análise (AI Assessment)
 * Título oficial: "Resultado da análise"
 * - Classificação oficial nos 5 níveis
 * - Principais motivos da classificação
 * - Evidências de suporte
 * - Explicações alternativas
 * - Informações que permanecem não verificadas
 * - Próximos passos recomendados
 * - Botão "Consultar opções de denúncia"
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Scale,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { AIAnalysisResult } from '../../types';

interface AIAssessmentSectionProps {
  aiResult: AIAnalysisResult;
  isLoading: boolean;
  onRefreshAi: () => void;
  onOpenReporting: () => void;
}

export const AIAssessmentSection: React.FC<AIAssessmentSectionProps> = ({
  aiResult,
  isLoading,
  onRefreshAi,
  onOpenReporting,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Mapeamento visual para as 5 classificações oficiais
  const getBadgeConfig = (classification: string) => {
    switch (classification) {
      case 'Sem indícios relevantes identificados':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
          headline: 'Conteúdo sem sinais evidentes de manipulação ou desinformação.',
        };
      case 'Indícios que merecem investigação':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          dot: 'bg-blue-500',
          icon: HelpCircle,
          headline: 'Foram identificadas inconsistências contextuais que recomendam cautela.',
        };
      case 'Possível conteúdo enganoso':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          headline: 'Presença de alegações temerárias ou desproporções relevantes.',
        };
      case 'Evidências consistentes de falsidade ou manipulação':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          dot: 'bg-rose-500',
          icon: AlertOctagon,
          headline: 'Identificadas alegações frontalmente contrárias a consensos oficiais ou normas.',
        };
      case 'Dados insuficientes para concluir':
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400',
          icon: HelpCircle,
          headline: 'Métricas públicas limitadas impossibilitam conclusão segura.',
        };
    }
  };

  const badge = getBadgeConfig(aiResult.classification);
  const Icon = badge.icon;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Cabeçalho Oficial Obrigatório */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans">
            Resultado da análise
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Avaliação contextual por inteligência artificial e cruzamento de evidências.
          </p>
        </div>

        <button
          onClick={onRefreshAi}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <RotateCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Reavaliando...' : 'Reavaliar com IA'}</span>
        </button>
      </div>

      {/* Classificação em Destaque */}
      <div className={`rounded-xl border p-4 ${badge.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div className="flex items-start sm:items-center gap-3">
          <Icon className="h-6 w-6 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight">
                {aiResult.classification}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-snug mt-0.5">{badge.headline}</p>
          </div>
        </div>

        <div className="text-left sm:text-right text-[11px] font-mono shrink-0 pt-1 sm:pt-0">
          <span>Nível de evidência: </span>
          <strong className="underline">{aiResult.confidenceLevel}</strong>
        </div>
      </div>

      {/* Síntese Concisa do Resultado */}
      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <p>{aiResult.evidenceSummary}</p>
      </div>

      {/* Grid com Principais Motivos, Evidências e Hipóteses Alternativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Motivos e Evidências de Suporte */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#00A86B] dark:text-emerald-400" />
            <span>Principais motivos e evidências de suporte</span>
          </h4>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed pl-5 list-disc">
            {aiResult.supportingObservations.map((obs, idx) => (
              <li key={idx}>{obs}</li>
            ))}
          </ul>
        </div>

        {/* Hipóteses Alternativas */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-[#003876] dark:text-blue-400" />
            <span>Hipóteses alternativas (contexto benigno)</span>
          </h4>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed pl-5 list-disc">
            {aiResult.alternativeExplanations.map((alt, idx) => (
              <li key={idx}>{alt}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão para Expandir Detalhes Técnicos e Limitações */}
      <div className="pt-1">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003876] dark:text-blue-400 hover:underline cursor-pointer"
        >
          <span>{showTechnicalDetails ? 'Ocultar detalhes técnicos' : 'Expandir detalhes técnicos e limitações'}</span>
          {showTechnicalDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showTechnicalDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs animate-in fade-in duration-150">
            {/* Informações que permanecem não verificadas */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50 dark:bg-slate-950/40">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Informações que permanecem não verificadas:
              </h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] pl-4 list-disc">
                {aiResult.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>

            {/* Próximos passos recomendados */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50 dark:bg-slate-950/40">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Próximos passos recomendados:
              </h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] pl-4 list-disc">
                {aiResult.recommendedNextSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Seção E: Encaminhamento para Opções de Denúncia */}
      <div className="pt-2 border-t border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <ShieldAlert className="h-4 w-4 text-slate-500 shrink-0" />
          <span>
            Identificou conteúdo irregular ou potencialmente danoso? Consulte orientações auditadas.
          </span>
        </div>

        {/* Botão Oficial Obrigatório */}
        <button
          onClick={onOpenReporting}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
          <span>Consultar opções de denúncia</span>
        </button>
      </div>
    </div>
  );
};
