/**
 * Fato ou Farsa - Gaveta Lateral de Histórico de Auditorias
 */

import React from 'react';
import { X, History, Trash2, ExternalLink, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { InvestigationReport } from '../../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reports: InvestigationReport[];
  onSelectReport: (report: InvestigationReport) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md h-full flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <History className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Histórico de Auditorias</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de Relatórios */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs italic">
              Nenhuma análise salva no histórico recente.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => {
                  onSelectReport(rep);
                  onClose();
                }}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-cyan-300">
                    @{rep.profile.username}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {rep.createdAt.split(',')[0]}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 truncate font-sans">
                  {rep.profile.fullName}
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] border-t border-slate-900">
                  <span className="text-slate-400 font-mono truncate max-w-[200px]">
                    {rep.aiAnalysis.classification}
                  </span>
                  <span className="text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Abrir <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com Limpeza */}
        {reports.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Limpar histórico</span>
            </button>
            <span className="text-[11px] text-slate-500">{reports.length} auditorias salvas</span>
          </div>
        )}
      </div>
    </div>
  );
};
