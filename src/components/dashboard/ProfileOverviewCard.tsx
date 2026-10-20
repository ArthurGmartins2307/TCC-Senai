/**
 * Fato ou Farsa - Seção A: Visão Geral do Perfil
 * - Nome de usuário
 * - URL do perfil
 * - Status da análise
 * - Número de postagens analisadas
 * - Fonte dos dados e horário da consulta
 */

import React from 'react';
import {
  ExternalLink,
  CheckCircle,
  Calendar,
  Layers,
  Database,
  RotateCcw,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { InstagramProfile } from '../../types';
import { formatNumberBR } from '../../utils/statistics';

interface ProfileOverviewCardProps {
  profile: InstagramProfile;
  totalPosts: number;
  isDemo: boolean;
  selectedDemoId: string;
  onSelectDemo: (demoId: string) => void;
  onNewAnalysis: () => void;
  onExport: () => void;
  onOpenReporting: () => void;
  investigatedAt: string;
}

export const ProfileOverviewCard: React.FC<ProfileOverviewCardProps> = ({
  profile,
  totalPosts,
  isDemo,
  selectedDemoId,
  onSelectDemo,
  onNewAnalysis,
  onExport,
  onOpenReporting,
  investigatedAt,
}) => {
  return (
    <div className="space-y-3">
      {/* Aviso de Modo Demonstração quando aplicável */}
      {isDemo && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Modo de demonstração — dados fictícios</span>
            <span className="text-amber-700 dark:text-amber-400">
              (Dados sintéticos didáticos para demonstrar critérios investigativos)
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <label className="text-[11px] font-medium text-amber-800 dark:text-amber-300">
              Trocar caso:
            </label>
            <select
              value={selectedDemoId}
              onChange={(e) => onSelectDemo(e.target.value)}
              className="rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="saude_vital">Saúde Vital (Alegações Médicas)</option>
              <option value="tech_investimentos">Tech Investimentos (Robô de Pix)</option>
              <option value="dra_mariana">Dra. Mariana (Perfil Científico)</option>
              <option value="noticias_urgente">Giro de Notícias (Vídeos Antigos)</option>
            </select>
          </div>
        </div>
      )}

      {/* Cartão de Visão Geral */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Foto e Metadados do Perfil */}
          <div className="flex items-start gap-4">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {profile.fullName}
                </h2>
                {profile.isVerified && (
                  <span
                    className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-300"
                    title="Perfil oficial verificado"
                  >
                    <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span>Verificado</span>
                  </span>
                )}
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                  {profile.category}
                </span>
              </div>

              {/* Nome de usuário e Link Direto */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium text-[#003876] dark:text-blue-400">
                  @{profile.username}
                </span>
                <span>•</span>
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <span className="truncate max-w-[200px] sm:max-w-xs">{profile.profileUrl}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Bio compacta */}
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-0.5 max-w-2xl leading-relaxed">
                {profile.biography}
              </p>

              {/* Informações Técnicas de Auditoria */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Status: <strong>Análise Concluída</strong>
                </span>
                <span>•</span>
                <span>
                  Amostragem: <strong>{totalPosts} postagens auditadas</strong>
                </span>
                <span>•</span>
                <span>
                  Consulta: <strong>{investigatedAt}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Fonte: <strong>Métricas Públicas Acessíveis</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center lg:flex-col lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-1.5 rounded-xl bg-[#003876] dark:bg-blue-600 hover:bg-[#002D62] dark:hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Analisar outro perfil</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                title="Exportar dados da auditoria"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar</span>
              </button>

              <button
                onClick={onOpenReporting}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span>Opções de denúncia</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
