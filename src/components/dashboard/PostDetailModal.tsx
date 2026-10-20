/**
 * Fato ou Farsa - Modal de Inspeção Detalhada do Vídeo do TikTok
 */

import React from 'react';
import {
  X,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Sparkles,
  Music,
  Video,
} from 'lucide-react';
import { TikTokVideo, StatisticalSummary } from '../../types';
import { formatNumberBR, formatPercentBR } from '../../utils/statistics';

interface PostDetailModalProps {
  post: TikTokVideo | null;
  stats: StatisticalSummary;
  onClose: () => void;
  onFactCheck?: (post: TikTokVideo) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  stats,
  onClose,
  onFactCheck,
}) => {
  if (!post) return null;

  const ratio =
    post.viewsCount && post.viewsCount > 0 && post.likesCount !== null
      ? (post.likesCount / post.viewsCount) * 100
      : null;

  const isAnomalousRatio = ratio !== null && ratio < 0.2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-cyan-800/40 bg-slate-900 shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 text-xs font-mono font-semibold text-cyan-300 uppercase flex items-center gap-1">
              <Video className="h-3.5 w-3.5" />
              <span>TikTok</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Publicado em {post.formattedDate}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo com Rolagem */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mídia, Legenda e Transcrição */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="sm:w-48 shrink-0">
              <img
                src={post.thumbnailUrl}
                alt="Miniatura do vídeo do TikTok"
                className="w-full h-48 sm:h-56 object-cover rounded-xl border border-slate-700 bg-slate-800 shadow"
              />
              {post.soundTitle && (
                <div className="mt-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Music className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{post.soundTitle}</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Legenda do TikTok
              </span>
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-wrap max-h-36 overflow-y-auto">
                {post.caption}
              </div>

              {post.transcript && (
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono block mb-1">
                    Transcrição do Áudio / Narração
                  </span>
                  <div className="p-3 rounded-xl border border-cyan-950 bg-cyan-950/20 text-xs text-cyan-100 leading-relaxed font-mono">
                    "{post.transcript}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grade de Métricas da Publicação */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono block mb-3">
              Métricas Auditadas do Vídeo
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <Eye className="h-3.5 w-3.5 text-cyan-400" /> Plays (Views)
                </span>
                <span className="text-sm font-mono font-bold text-slate-100">
                  {formatNumberBR(post.viewsCount)}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <Heart className="h-3.5 w-3.5 text-pink-400" /> Curtidas
                </span>
                <span className="text-sm font-mono font-bold text-slate-100">
                  {formatNumberBR(post.likesCount)}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <MessageCircle className="h-3.5 w-3.5 text-purple-400" /> Comentários
                </span>
                <span className="text-sm font-mono font-bold text-slate-100">
                  {formatNumberBR(post.commentsCount)}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  Taxa Curtidas/Views
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    isAnomalousRatio ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {formatPercentBR(ratio, 2)}
                </span>
              </div>
            </div>
          </div>

          {/* Alertas e Avaliação Forense */}
          {post.suspicionFlags.length > 0 ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>Sinais de Atenção Identificados no Vídeo</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200/90 pl-6 list-disc">
                {post.suspicionFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
              {post.evidenceNotes && (
                <div className="mt-3 pt-2.5 border-t border-amber-500/20 text-[11px] text-amber-300/80">
                  <strong>Nota técnica:</strong> {post.evidenceNotes}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>
                Nenhum desvio crítico ou alegação alarmista detectada neste vídeo do TikTok.
              </span>
            </div>
          )}

          {/* Princípio de Incerteza Explicada */}
          <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
            <strong>Lembrete metodológico do Fato ou Farsa:</strong> Números atípicos em vídeos
            curtos do TikTok podem refletir tanto impulsionamento inautêntico quanto a dinâmica da página "Para Você" (FYP) ou compartilhamento viral externo. Métricas, isoladamente, não comprovam falsidade.
          </div>
        </div>

        {/* Rodapé com link externo e ação de checagem */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/60 px-6 py-4">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Ver vídeo no TikTok</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <div className="flex items-center gap-2">
            {onFactCheck && (
              <button
                onClick={() => {
                  onClose();
                  onFactCheck(post);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Checar Alegações com IA</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Fechar inspeção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
