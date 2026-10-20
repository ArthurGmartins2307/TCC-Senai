/**
 * Fato ou Farsa - Seção C: Análise de Publicações (Publication Analysis)
 * - Tabela limpa e legível com: Publicação, Data, Visualizações, Curtidas, Indicadores, Avaliação
 * - Ordenação e filtragem
 * - Gráfico único e focado para identificação de padrões
 * - Modal de inspeção detalhada
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  FileSearch,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { InstagramPost, StatisticalSummary } from '../../types';
import {
  formatNumberBR,
  formatCompactNumberBR,
  formatPercentBR,
} from '../../utils/statistics';

interface PublicationAnalysisSectionProps {
  posts: InstagramPost[];
  stats: StatisticalSummary;
  onSelectPost: (post: InstagramPost) => void;
  onFactCheckPost?: (post: InstagramPost) => void;
}

type FilterStatus = 'all' | 'outliers' | 'alerts' | 'missing';
type SortKey = 'date' | 'views' | 'likes';

export const PublicationAnalysisSection: React.FC<PublicationAnalysisSectionProps> = ({
  posts,
  stats,
  onSelectPost,
  onFactCheckPost,
}) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChart, setShowChart] = useState(true);

  // Filtragem
  const filteredPosts = posts.filter((post) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!post.caption.toLowerCase().includes(q)) return false;
    }
    if (filter === 'outliers') return post.isOutlier;
    if (filter === 'alerts') return post.suspicionFlags.length > 0;
    if (filter === 'missing') return post.viewsCount === null;
    return true;
  });

  // Ordenação
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    let diff = 0;
    if (sortKey === 'views') {
      diff = (a.viewsCount || 0) - (b.viewsCount || 0);
    } else if (sortKey === 'likes') {
      diff = (a.likesCount || 0) - (b.likesCount || 0);
    } else {
      diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return sortAsc ? diff : -diff;
  });

  // Cálculo para o gráfico único e focado (Linha cronológica de reproduções vs curtidas)
  const chronologicalPosts = [...posts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const maxViews = Math.max(...posts.map((p) => p.viewsCount || 0), 1000);
  const maxLikes = Math.max(...posts.map((p) => p.likesCount || 0), 100);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans">
            Análise de Publicações
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inspeção individual das postagens auditadas e verificação de desvios métricos.
          </p>
        </div>

        <button
          onClick={() => setShowChart(!showChart)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003876] dark:text-blue-400 hover:underline cursor-pointer self-start sm:self-auto"
        >
          <BarChart2 className="h-3.5 w-3.5" />
          <span>{showChart ? 'Ocultar gráfico' : 'Exibir gráfico de dispersão'}</span>
        </button>
      </div>

      {/* Gráfico Único e Focado (Conforme Seção 6.C: Priorizar uma visualização útil) */}
      {showChart && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Distribuição Cronológica de Visualizações vs. Curtidas
            </span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#003876] dark:bg-blue-500" />
                Visualizações
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#00A86B] dark:bg-emerald-500" />
                Curtidas
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#F5B800]" />
                Outlier
              </span>
            </div>
          </div>

          <div className="h-44 w-full flex items-end gap-3 sm:gap-6 pt-4 pb-1 border-b border-slate-200 dark:border-slate-800">
            {chronologicalPosts.map((post) => {
              const viewsHeight = post.viewsCount
                ? Math.max(10, Math.min(100, (post.viewsCount / maxViews) * 100))
                : 4;
              const likesHeight = post.likesCount
                ? Math.max(6, Math.min(100, (post.likesCount / maxLikes) * 100))
                : 4;

              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer group"
                  title={`[${post.formattedDate}] Views: ${formatNumberBR(post.viewsCount)} | Likes: ${formatNumberBR(post.likesCount)}`}
                >
                  {post.isOutlier && (
                    <div className="absolute top-0 text-[9px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-800 rounded px-1 -translate-y-1 whitespace-nowrap">
                      Outlier
                    </div>
                  )}

                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      style={{ height: `${viewsHeight}%` }}
                      className={`w-1/2 rounded-t-sm transition-all ${
                        post.isOutlier
                          ? 'bg-[#F5B800] group-hover:opacity-90'
                          : 'bg-[#003876] dark:bg-blue-500 group-hover:opacity-90'
                      }`}
                    />
                    <div
                      style={{ height: `${likesHeight}%` }}
                      className="w-1/2 rounded-t-sm bg-[#00A86B] dark:bg-emerald-500 group-hover:opacity-90 transition-all"
                    />
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-full">
                    {post.formattedDate.split(' ')[0]} {post.formattedDate.split(' ')[2]?.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controles de Busca e Filtro da Tabela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filtros de Status */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: `Todas (${posts.length})` },
            { id: 'outliers', label: `Outliers (${posts.filter((p) => p.isOutlier).length})` },
            { id: 'alerts', label: `Com alertas (${posts.filter((p) => p.suspicionFlags.length > 0).length})` },
            { id: 'missing', label: `Sem views (${posts.filter((p) => p.viewsCount === null).length})` },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as FilterStatus)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                filter === btn.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por termo..."
            className="w-full sm:w-48 rounded-lg border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003876] dark:focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabela de Publicações (Seção 6.C: Publicação, Data, Visualizações, Curtidas, Indicadores, Avaliação) */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-3.5 py-2.5">Publicação</th>
              <th
                onClick={() => {
                  if (sortKey === 'date') setSortAsc(!sortAsc);
                  else {
                    setSortKey('date');
                    setSortAsc(false);
                  }
                }}
                className="px-3.5 py-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Data</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => {
                  if (sortKey === 'views') setSortAsc(!sortAsc);
                  else {
                    setSortKey('views');
                    setSortAsc(false);
                  }
                }}
                className="px-3.5 py-2.5 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Visualizações</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => {
                  if (sortKey === 'likes') setSortAsc(!sortAsc);
                  else {
                    setSortKey('likes');
                    setSortAsc(false);
                  }
                }}
                className="px-3.5 py-2.5 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Curtidas</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-3.5 py-2.5 text-center">Indicadores</th>
              <th className="px-3.5 py-2.5 text-center">Avaliação</th>
              <th className="px-3.5 py-2.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
            {sortedPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                  Nenhuma publicação encontrada para o filtro ativo.
                </td>
              </tr>
            ) : (
              sortedPosts.map((post) => {
                const ratio =
                  post.viewsCount && post.viewsCount > 0 && post.likesCount !== null
                    ? (post.likesCount / post.viewsCount) * 100
                    : null;

                const isAnomalousRatio = ratio !== null && ratio < 0.2;

                return (
                  <tr
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    {/* Publicação (Thumbnail + Tipo + Legenda) */}
                    <td className="px-3.5 py-2.5 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.thumbnailUrl}
                          alt="Thumbnail"
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 dark:text-slate-400 mr-1.5">
                            [{post.type}]
                          </span>
                          <span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate block">
                            {post.caption}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Data */}
                    <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {post.formattedDate}
                    </td>

                    {/* Visualizações */}
                    <td className="px-3.5 py-2.5 text-right font-mono whitespace-nowrap">
                      {post.viewsCount !== null ? (
                        <span className={post.isOutlier ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
                          {formatNumberBR(post.viewsCount)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Indisponível</span>
                      )}
                    </td>

                    {/* Curtidas */}
                    <td className="px-3.5 py-2.5 text-right font-mono whitespace-nowrap">
                      {post.likesCount !== null ? (
                        formatNumberBR(post.likesCount)
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Indisponível</span>
                      )}
                    </td>

                    {/* Indicadores */}
                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                      {isAnomalousRatio ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 text-[10px] font-mono text-amber-700 dark:text-amber-300">
                          Discrepância ({formatPercentBR(ratio, 2)})
                        </span>
                      ) : ratio !== null ? (
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                          Regular ({formatPercentBR(ratio, 1)})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-mono">Sem taxa</span>
                      )}
                    </td>

                    {/* Avaliação */}
                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                      {post.isOutlier ? (
                        <span className="rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 text-[10px] font-mono font-semibold">
                          Outlier
                        </span>
                      ) : post.suspicionFlags.length > 0 ? (
                        <span className="rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2 py-0.5 text-[10px] font-mono font-semibold">
                          Alerta
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 text-[10px] font-mono">
                          Padrão
                        </span>
                      )}
                    </td>

                    {/* Ação */}
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onFactCheckPost && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFactCheckPost(post);
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer"
                            title="Checar alegações e evidências desta postagem"
                          >
                            <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Checar Fato</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPost(post);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          <FileSearch className="h-3 w-3" />
                          <span>Ver</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
