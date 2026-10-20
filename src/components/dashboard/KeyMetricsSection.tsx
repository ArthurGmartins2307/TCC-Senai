/**
 * Fato ou Farsa - Seção B: Métricas Principais (Key Metrics)
 * Cards compactos essenciais:
 * 1. Média de visualizações (com contagem de posts elegíveis)
 * 2. Média de curtidas (com contagem de posts elegíveis)
 * 3. Mediana de visualizações (com contagem de posts elegíveis)
 * 4. Publicações analisadas (total e dados ausentes destacados)
 */

import React from 'react';
import { Eye, Heart, BarChart2, Layers, Info } from 'lucide-react';
import { StatisticalSummary } from '../../types';
import {
  formatNumberBR,
  formatCompactNumberBR,
  formatPercentBR,
} from '../../utils/statistics';

interface KeyMetricsSectionProps {
  stats: StatisticalSummary;
}

export const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ stats }) => {
  const eligibleViewsCount = stats.postsWithMetricsCount;
  const eligibleLikesCount = stats.postsWithMetricsCount;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          Métricas Principais Calculadas
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Valores ausentes não são tratados como zero
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Média de visualizações */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Média de visualizações
            </span>
            <Eye className="h-4 w-4 text-[#003876] dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatCompactNumberBR(stats.avgViews)}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({formatNumberBR(stats.avgViews)})
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>Posts elegíveis:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {eligibleViewsCount} de {stats.totalPostsAnalyzed}
            </span>
          </div>
        </div>

        {/* Card 2: Média de curtidas */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Média de curtidas
            </span>
            <Heart className="h-4 w-4 text-[#00A86B] dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatCompactNumberBR(stats.avgLikes)}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({formatNumberBR(stats.avgLikes)})
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>Posts elegíveis:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {eligibleLikesCount} de {stats.totalPostsAnalyzed}
            </span>
          </div>
        </div>

        {/* Card 3: Mediana de visualizações */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Mediana de visualizações
            </span>
            <BarChart2 className="h-4 w-4 text-[#F5B800] dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatCompactNumberBR(stats.medianViews)}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({formatNumberBR(stats.medianViews)})
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>Resistente a outliers:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Comportamento típico
            </span>
          </div>
        </div>

        {/* Card 4: Publicações analisadas */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Publicações analisadas
            </span>
            <Layers className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {stats.totalPostsAnalyzed}
            </span>
            <span className="text-xs text-slate-500 font-mono">postagens</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>Sem métricas de views:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {stats.postsWithMissingMetricsCount} (fotos/carrosséis)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
