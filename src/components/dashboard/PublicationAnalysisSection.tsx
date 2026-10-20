/**
 * Fato ou Farsa - Seção C: Análise de Vídeos do TikTok
 * - Tabela limpa e legível: Vídeo/Legenda, Data, Visualizações (Plays), Curtidas, Taxa de Conversão, Indicadores
 * - Ordenação e filtragem por anomalias e alertas de desinformação
 * - Gráfico de dispersão cronológica de reproduções vs curtidas no TikTok
 * - Modal de inspeção detalhada com transcrição e checagem factual
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
  Video,
  FileCheck2,
} from 'lucide-react';
import { TikTokVideo, StatisticalSummary } from '../../types';
import {
  formatNumberBR,
  formatCompactNumberBR,
  formatPercentBR,
} from '../../utils/statistics';

interface PublicationAnalysisSectionProps {
  posts: TikTokVideo[];
  stats: StatisticalSummary;
  onSelectPost: (post: TikTokVideo) => void;
  onFactCheckPost?: (post: TikTokVideo) => void;
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
      const inCaption = post.caption.toLowerCase().includes(q);
      const inTranscript = post.transcript?.toLowerCase().includes(q) || false;
      const inSound = post.soundTitle?.toLowerCase().includes(q) || false;
      if (!inCaption && !inTranscript && !inSound) return false;
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

  // Linha cronológica de reproduções vs curtidas
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
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-[#003876] dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans">
              Análise de Vídeos do TikTok
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inspeção individual dos vídeos auditados, transcrições e verificação de desvios métricos.
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

      {/* Gráfico Focado: Reproduções vs Curtidas no TikTok */}
      {showChart && chronologicalPosts.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Dispersão Cronológica: Reproduções (azul) vs Curtidas (verde)
            </span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#003876] dark:bg-blue-500" />
                Visualizações (Plays)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#00A86B] dark:bg-emerald-500" />
                Curtidas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Desvio Crítico (Outlier)
              </span>
            </div>
          </div>

          {/* Gráfico de Barras Relativas */}
          <div className="h-32 flex items-end gap-2 sm:gap-3 pt-4 px-2 border-b border-slate-200 dark:border-slate-800">
            {chronologicalPosts.map((post, idx) => {
              const viewHeight = post.viewsCount
                ? Math.max(12, Math.round((post.viewsCount / maxViews) * 100))
                : 6;
              const likeHeight = post.likesCount
                ? Math.max(6, Math.round((post.likesCount / maxLikes) * 100))
                : 3;

              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative h-full justify-end"
                  title={`Vídeo ${idx + 1}: ${post.viewsCount ? formatNumberBR(post.viewsCount) : 'Sem'} views, ${post.likesCount ? formatNumberBR(post.likesCount) : '0'} curtidas`}
                >
                  {/* Marcador de Outlier */}
                  {post.isOutlier && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping absolute -top-1" />
                  )}

                  {/* Barra Dupla: Views e Curtidas */}
                  <div className="w-full max-w-[28px] flex items-end justify-center gap-0.5 h-full">
                    <div
                      style={{ height: `${viewHeight}%` }}
                      className={`w-1/2 rounded-t transition-all ${
                        post.isOutlier
                          ? 'bg-amber-500/80 group-hover:bg-amber-600'
                          : 'bg-[#003876] dark:bg-blue-600 group-hover:bg-[#002D62]'
                      }`}
                    />
                    <div
                      style={{ height: `${likeHeight}%` }}
                      className="w-1/2 rounded-t bg-[#00A86B] dark:bg-emerald-500 group-hover:bg-[#008f5a] transition-all"
                    />
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 truncate w-full text-center">
                    V{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Dica: Clique em qualquer coluna para abrir a inspeção completa e transcrição do vídeo correspondente.
          </p>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Campo de Busca Rápida */}
        <div className="relative flex-1 max-w-sm">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por termo na legenda ou áudio..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003876]"
          />
        </div>

        {/* Botões de Filtro */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Todos ({posts.length})
          </button>
          <button
            onClick={() => setFilter('outliers')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'outliers'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            Outliers ({posts.filter((p) => p.isOutlier).length})
          </button>
          <button
            onClick={() => setFilter('alerts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'alerts'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            Com alertas ({posts.filter((p) => p.suspicionFlags.length > 0).length})
          </button>
        </div>
      </div>

      {/* Tabela de Publicações */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            <tr>
              <th className="px-3.5 py-2.5">Vídeo / Legenda do TikTok</th>
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
                  <span>Plays</span>
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
              <th className="px-3.5 py-2.5 text-center">Taxa / Indicador</th>
              <th className="px-3.5 py-2.5 text-center">Avaliação</th>
              <th className="px-3.5 py-2.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
            {sortedPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                  Nenhum vídeo encontrado para o filtro ativo.
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
                    {/* Vídeo (Thumbnail + Legenda + Som) */}
                    <td className="px-3.5 py-2.5 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.thumbnailUrl}
                          alt="Thumbnail"
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 dark:text-slate-400 mr-1.5">
                            [TikTok]
                          </span>
                          <span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate block">
                            {post.caption}
                          </span>
                          {post.soundTitle && (
                            <span className="text-[10px] text-slate-400 truncate block">
                              🎵 {post.soundTitle}
                            </span>
                          )}
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
                      ) : (
                        <span className="rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-mono">
                          Padrão
                        </span>
                      )}
                    </td>

                    {/* Ação */}
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {onFactCheckPost && (
                          <button
                            onClick={() => onFactCheckPost(post)}
                            className="inline-flex items-center gap-1 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                            title="Checar alegações deste vídeo do TikTok com fontes"
                          >
                            <FileCheck2 className="h-3 w-3 text-emerald-600" />
                            <span>Checar Fatos</span>
                          </button>
                        )}
                        <button
                          onClick={() => onSelectPost(post)}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <FileSearch className="h-3 w-3 text-[#003876] dark:text-blue-400" />
                          <span>Detalhes</span>
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
